import {GameEvent} from '../Document/GameEvent'
import {IDocumentListener} from '../Document/IDocumentListener'
import {TetrisDocument, TileData} from '../Document/TetrisDocument'
import {Renderable} from '../types'
import {Renderer} from './Renderer'

class NextTetraminoView implements Renderable, IDocumentListener {
	private tiles: TileData[] = []
	private offsetX = 12  // смещение для отрисовки "следующего" тетрамино
	private offsetY = 10

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
		private readonly gameDocument: TetrisDocument,
		private readonly renderer: Renderer,
	) {
		gameDocument.addListener(this)
	}

	render() {
		this.tiles.forEach(tileData => {
			if (tileData.tile) {
				const {color, x, y} = tileData.tile
				this.renderer.drawColoredQuad(x + this.offsetX, y + this.offsetY, 1, 1, color)
			}
		})
	}

	notify(event: GameEvent) {
		if (event.type === 'nextTetramino') {
			this.tiles = event.data.newTiles
		}
	}
}

export {
	NextTetraminoView,
}
