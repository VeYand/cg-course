import {GameEvent} from './GameEvent'
import {IDocumentListener} from './IDocumentListener'
import {Tetramino, TETRAMINO_TYPE} from './Tetris'


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

class TetrisDocument {
	private field: TileData[][]

	private currentTetramino: Tetramino
	private nextTetramino: Tetramino

	private listeners: IDocumentListener[] = []
	private previousMovingTiles: TileData[] = []

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
			const prevTiles = this.getTetraminoTileData(this.currentTetramino)
			this.currentTetramino.rotate()
			const newTiles = this.getTetraminoTileData(this.currentTetramino)
			const delta = this.computeDelta(prevTiles, newTiles)
			this.previousMovingTiles = newTiles
			this.notify({type: 'updatedField', data: {newTiles: delta}})
		}
	}

	moveCurrentTetramino(dx: number, dy: number) {
		if (this.canMove(this.currentTetramino, dx, dy)) {
			const prevTiles = this.getTetraminoTileData(this.currentTetramino)
			this.currentTetramino.move(dx, dy)
			const newTiles = this.getTetraminoTileData(this.currentTetramino)
			const delta = this.computeDelta(prevTiles, newTiles)
			this.previousMovingTiles = newTiles
			this.notify({type: 'updatedField', data: {newTiles: delta}})
		}
		else {
			this.fixTetramino()
			this.spawnNextTetramino()
		}
	}

	getScore() {
		return 123
	}

	getField() {
		return this.field
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
			throw new Error('Error on generate tetramino')
		}
		return new Tetramino(randomType)
	}


	private notify(event: GameEvent) {
		this.listeners.forEach(listener => listener.notify(event))
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

	private getTetraminoTileData(tetramino: Tetramino): TileData[] {
		const blocks = tetramino.getBlocks()
		const color = this.getColorForTetramino(tetramino.getType())
		return blocks.map(block => {
			const absX = tetramino.getPosition().x + block.x
			const absY = tetramino.getPosition().y + block.y
			return {
				tile: {
					color,
					x: absX,
					y: absY,
				},
			}
		})
	}

	private canMove(tetramino: Tetramino, dx: number, dy: number): boolean {
		for (const block of tetramino.getBlocks()) {
			const newX = tetramino.getPosition().x + block.x + dx
			const newY = tetramino.getPosition().y + block.y + dy
			if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {
				return false
			}
			if (this.field[newY][newX].tile !== undefined) {
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
			if (this.field[y][x].tile !== undefined) {
				return false
			}
		}
		return true
	}

	private fixTetramino() {
		const tetrominoTiles = this.getTetraminoTileData(this.currentTetramino)
		tetrominoTiles.forEach(tileData => {
			const x = tileData.tile!.x
			const y = tileData.tile!.y
			this.field[y][x] = {tile: tileData.tile}
		})
		this.notify({type: 'updatedField', data: {newTiles: tetrominoTiles}})
		this.clearLines()
	}

	private clearLines() {
		const clearedLines: number[] = []
		for (let y = 0; y < this.rows; y++) {
			if (this.field[y].every(cell => cell.tile !== undefined)) {
				clearedLines.push(y)
				for (let x = 0; x < this.cols; x++) {
					this.field[y][x] = {}
				}
				for (let row = y; row > 0; row--) {
					this.field[row] = this.field[row - 1].map(cell => ({...cell}))
				}
				this.field[0] = Array.from({length: this.cols}, () => ({}))
			}
		}
		if (clearedLines.length) {
			this.notify({type: 'lineClear', data: {lines: clearedLines}})
			const changedTiles: TileData[] = []
			for (let y = 0; y < this.rows; y++) {
				for (let x = 0; x < this.cols; x++) {
					const tile = this.field[y][x].tile
					changedTiles.push(tile ? {tile: {...tile, x, y}} : {tile: undefined})
				}
			}
			this.notify({type: 'updatedField', data: {newTiles: changedTiles}})
		}
	}

	private spawnNextTetramino() {
		this.currentTetramino = this.nextTetramino
		this.currentTetramino.setPosition({x: Math.floor(this.cols / 2) - 1, y: 0})
		this.previousMovingTiles = this.getTetraminoTileData(this.currentTetramino)
		this.notify({type: 'nextTetramino', data: {newTiles: this.previousMovingTiles}})
		this.nextTetramino = this.generateTetramino()
		if (!this.canMove(this.currentTetramino, 0, 0)) {
			this.notify({type: 'gameOver'})
		}
	}

	private computeDelta(prev: TileData[], curr: TileData[]): TileData[] {
		const deltaMap: {[key: string]: TileData} = {}
		const key = (td: TileData) => (td.tile ? `${td.tile.x},${td.tile.y}` : '')
		prev.forEach(td => {
			if (td.tile) {
				deltaMap[key(td)] = {tile: undefined}
			}
		})
		curr.forEach(td => {
			if (td.tile) {
				deltaMap[key(td)] = td
			}
		})
		return Object.values(deltaMap)
	}
}

export type {
	TileData,
}

export {
	TetrisDocument,
}