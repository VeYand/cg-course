import {GameEvent} from './GameEvent'
import {IDocumentListener} from './IDocumentListener'
import {Tetramino, TETRAMINO_TYPE} from './Tetramino'

type Color = {
	r: number,
	g: number,
	b: number,
}

type Tile = {
	color: Color,
	x: number,
	y: number,
}

type TileData = {
	tile?: Tile,
}

enum HORIZONTAL_DIRECTION {
	LEFT = 'left',
	RIGHT = 'right',
}

enum VERTICAL_DIRECTION {
	DOWN = 'down',
}

type DIRECTION = HORIZONTAL_DIRECTION | VERTICAL_DIRECTION

class TetrisDocument {
	private field: TileData[][]
	private currentTetramino: Tetramino
	private nextTetramino: Tetramino
	private listeners: IDocumentListener[] = []
	private previousMovingTiles: TileData[] = []

	private score = 0
	private level = 1
	private linesCleared = 0
	private linesToLevelUp = 10
	private dropSpeed = 1000
	private gameOver = false

	constructor(
		private readonly rows: number,
		private readonly cols: number,
	) {
		this.field = this.createEmptyField()
		this.currentTetramino = this.generateTetramino()
		this.nextTetramino = this.generateTetramino()
		this.previousMovingTiles = this.getTetraminoTileData(this.currentTetramino)
	}

	addListener(listener: IDocumentListener) {
		this.listeners.push(listener)
	}

	rotateCurrentTetramino() {
		const rotated = this.currentTetramino.getRotatedVersion()
		if (this.canRotate(rotated)) {
			this.currentTetramino.rotate()
			this.previousMovingTiles = this.getTetraminoTileData(this.currentTetramino)
			this.notify({type: 'tetraminoFieldUpdated'})
		}
	}

	lowerTetramino() {
		this.moveCurrentTetraminoImpl(VERTICAL_DIRECTION.DOWN)
	}

	moveCurrentTetramino(direction: HORIZONTAL_DIRECTION) {
		this.moveCurrentTetraminoImpl(direction)
	}


	getLinesToLevelUp() {
		return this.linesToLevelUp
	}

	getCurrentTetraminoTiles(): TileData[] {
		return this.getTetraminoTileData(this.currentTetramino)
	}

	getField() {
		return this.field
	}

	restartGame() {
		this.startGame()
	}

	private startGame() {
		this.field = this.createEmptyField()
		this.score = 0
		this.level = 1
		this.linesCleared = 0
		this.linesToLevelUp = 10
		this.dropSpeed = 1000
		this.gameOver = false
		this.currentTetramino = this.generateTetramino()
		this.nextTetramino = this.generateTetramino()
		this.previousMovingTiles = this.getTetraminoTileData(this.currentTetramino)
		this.notify({type: 'tetraminoFieldUpdated'})
		this.gameTickHandler()
	}

	private gameTickHandler() {
		if (this.gameOver) {
			return
		}

		this.lowerTetramino()
		setTimeout(() => this.gameTickHandler(), this.dropSpeed)
	}

	private isTetraminoLies() {
		for (const block of this.currentTetramino.getBlocks()) {
			const xUnderBlock = this.currentTetramino.getPosition().x + block.x
			const yUnderBlock = this.currentTetramino.getPosition().y + block.y - 1
			if (yUnderBlock < 0) {
				return true
			}
			if (this.field[yUnderBlock]?.[xUnderBlock]?.tile !== undefined) {
				return true
			}
		}
		return false
	}

	private createEmptyField(): TileData[][] {
		const field: TileData[][] = []
		for (let y = 0; y < this.rows; y++) {
			const row: TileData[] = []
			for (let x = 0; x < this.cols; x++) {
				row.push({})
			}
			field.push(row)
		}
		return field
	}

	private generateTetramino(): Tetramino {
		const types = Object.values(TETRAMINO_TYPE)
		const randomType = types[Math.floor(Math.random() * types.length)]
		if (!randomType) {
			throw new Error('Ошибка при генерации тетрамино')
		}
		return new Tetramino(randomType)
	}

	private getColorForTetramino(type: TETRAMINO_TYPE): Color {
		switch (type) {
			case TETRAMINO_TYPE.I:
				return {r: 0, g: 255, b: 255}
			case TETRAMINO_TYPE.O:
				return {r: 255, g: 255, b: 0}
			case TETRAMINO_TYPE.T:
				return {r: 128, g: 0, b: 128}
			case TETRAMINO_TYPE.S:
				return {r: 0, g: 255, b: 0}
			case TETRAMINO_TYPE.Z:
				return {r: 255, g: 0, b: 0}
			case TETRAMINO_TYPE.J:
				return {r: 0, g: 0, b: 255}
			case TETRAMINO_TYPE.L:
				return {r: 255, g: 165, b: 0}
			default:
				return {r: 255, g: 255, b: 255}
		}
	}

	private moveCurrentTetraminoImpl(direction: DIRECTION) {
		const {dx, dy} = this.parseDirection(direction)
		if (this.canMove(this.currentTetramino, dx, dy)) {
			this.currentTetramino.move(dx, dy)
			this.previousMovingTiles = this.getTetraminoTileData(this.currentTetramino)
			this.notify({type: 'tetraminoFieldUpdated'})
		}
		else if (this.isTetraminoLies()) {
			this.fixTetramino()
			this.spawnNextTetramino()
		}
	}

	private getTetraminoTileData(tetramino: Tetramino): TileData[] {
		const blocks = tetramino.getBlocks()
		const color = this.getColorForTetramino(tetramino.getType())
		return blocks.map(block => ({
			tile: {
				color,
				x: tetramino.getPosition().x + block.x,
				y: tetramino.getPosition().y + block.y,
			},
		}))
	}

	private canMove(tetramino: Tetramino, dx: number, dy: number): boolean {
		for (const block of tetramino.getBlocks()) {
			const newX = tetramino.getPosition().x + block.x + dx
			const newY = tetramino.getPosition().y + block.y + dy
			if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {
				return false
			}
			if (this.field[newY]?.[newX]?.tile !== undefined) {
				return false
			}
		}
		return true
	}

	private canRotate(rotated: Tetramino): boolean {
		for (const block of rotated.getBlocks()) {
			const x = rotated.getPosition().x + block.x
			const y = rotated.getPosition().y + block.y
			if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
				return false
			}
			if (this.field[y]?.[x]?.tile !== undefined) {
				return false
			}
		}
		return true
	}

	private fixTetramino() {
		const tetrominoTiles = this.getTetraminoTileData(this.currentTetramino)
		tetrominoTiles.forEach(tileData => {
			if (tileData.tile) {
				const x = tileData.tile.x
				const y = tileData.tile.y
				if (this.field[y]?.[x] !== undefined) {
					// @ts-expect-error
					this.field[y][x] = {tile: tileData.tile}
				}
			}
		})
		this.notify({type: 'tetraminoFieldUpdated'})
		this.clearLines()
	}

	private clearLines() {
		const clearedLines: number[] = []
		for (let y = 0; y < this.rows; y++) {
			if (this.field[y]?.every(cell => cell.tile !== undefined)) {
				clearedLines.push(y)
				for (let x = 0; x < this.cols; x++) {
					if (this.field[y]?.[x] !== undefined) {
						// @ts-expect-error
						this.field[y][x] = {}
					}
				}
				for (let row = y; row > 0; row--) {
					if (this.field[row] !== undefined) {
						// @ts-expect-error
						this.field[row] = this.field[row - 1]?.map(cell => ({...cell}))
					}
				}
				this.field[0] = Array.from({length: this.cols}, () => ({}))
			}
		}
		if (clearedLines.length) {
			let points = 0
			switch (clearedLines.length) {
				case 1:
					points = 10
					break
				case 2:
					points = 30
					break
				case 3:
					points = 70
					break
				case 4:
					points = 150
					break
				default:
					points = 200
			}
			this.score += points
			this.linesCleared += clearedLines.length
			this.notify({type: 'clearedLines'})
			this.notify({type: 'tetraminoFieldUpdated'})
			this.checkLevelUp()
		}
	}

	private checkLevelUp() {
		if (this.linesCleared >= this.linesToLevelUp) {
			const freeRows = this.field.reduce((count, row) => count + (row.every(cell => cell.tile === undefined) ? 1 : 0), 0)
			const bonus = freeRows * 10
			this.score += bonus
			this.field = this.createEmptyField()
			this.level++
			this.dropSpeed = Math.max(200, this.dropSpeed - 100)
			this.linesToLevelUp += 10
			this.linesCleared = 0
			this.notify({
				type: 'scoreUpdated',
				data: {score: this.score, level: this.level, clearedLines: this.linesCleared},
			})
			this.notify({type: 'tetraminoFieldUpdated'})
		}
	}

	private spawnNextTetramino() {
		this.currentTetramino = this.nextTetramino
		this.currentTetramino.setPosition({x: Math.floor(this.cols / 2) - 1, y: 18})
		this.previousMovingTiles = this.getTetraminoTileData(this.currentTetramino)
		this.notify({type: 'nextTetramino', data: {newTiles: this.previousMovingTiles}})
		this.nextTetramino = this.generateTetramino()
		if (!this.canMove(this.currentTetramino, 0, 0)) {
			this.handleGameOver()
		}
	}

	private parseDirection(direction: DIRECTION): ({dx: number, dy: number}) {
		let dx = 0
		let dy = 0

		switch (direction) {
			case HORIZONTAL_DIRECTION.RIGHT:
				dx = 1
				break
			case HORIZONTAL_DIRECTION.LEFT:
				dx = -1
				break
			case VERTICAL_DIRECTION.DOWN:
				dy = -1
				break
		}

		return {
			dx, dy,
		}
	}

	private handleGameOver() {
		this.gameOver = true
		this.notify({type: 'gameOver'})
	}

	private notify(event: GameEvent) {
		this.listeners.forEach(listener => listener.notify(event))
	}
}

export type {
	TileData,
	Color,
}

export {
	TetrisDocument,
	HORIZONTAL_DIRECTION,
}
