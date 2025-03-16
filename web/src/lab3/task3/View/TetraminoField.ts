import {GameEvent} from '../Document/GameEvent'
import {IDocumentListener} from '../Document/IDocumentListener'
import {TetrisDocument} from '../Document/TetrisDocument'
import {Renderer} from './Renderer'

class TetraminoField implements IDocumentListener {
	private readonly boardOffsetX = -5
	private readonly boardOffsetY = -10

	constructor(
		private readonly gameDocument: TetrisDocument,
		private readonly renderer: Renderer,
	) {
		gameDocument.addListener(this)
	}

	render() {
		const field = this.gameDocument.getField()
		for (let y = 0; y < field.length; y++) {
			for (let x = 0; x < field[y].length; x++) {
				const cell = field[y][x]
				if (cell?.tile) {
					const {color} = cell.tile
					this.renderer.drawColoredQuad({x: x + this.boardOffsetX, y: y + this.boardOffsetY}, {width: 1, height: 1}, color)
				}
			}
		}
		const currentTiles = this.gameDocument.getCurrentTetraminoTiles()
		currentTiles.forEach(tileData => {
			if (tileData.tile) {
				const {color, x, y} = tileData.tile
				this.renderer.drawColoredQuad({x: x + this.boardOffsetX, y: y + this.boardOffsetY}, {width: 1, height: 1}, color)
			}
		})
	}

	notify(_: GameEvent) {
	}
}

export {TetraminoField}
