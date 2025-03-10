import {GameEvent} from '../Document/GameEvent'
import {IDocumentListener} from '../Document/IDocumentListener'
import {TetrisDocument} from '../Document/TetrisDocument'
import {Renderable} from '../types'
import {Renderer} from './Renderer'

class TetraminoField implements Renderable, IDocumentListener {
	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
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
				if (cell.tile) {
					const {color} = cell.tile
					this.renderer.drawColoredQuad(x, y, 1, 1, color)
				}
			}
		}
	}

	notify(event: GameEvent) {
		// При необходимости можно обработать обновления поля
	}
}

export {TetraminoField}
