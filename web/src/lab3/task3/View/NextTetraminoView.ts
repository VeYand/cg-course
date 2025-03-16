import {GameEvent} from '../Document/GameEvent'
import {IDocumentListener} from '../Document/IDocumentListener'
import {TetrisDocument, TileData} from '../Document/TetrisDocument'
import {Renderer} from './Renderer'

class NextTetraminoView implements IDocumentListener {
	private tiles: TileData[] = []
	private offsetX = 7
	private offsetY = -8

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
		private readonly gameDocument: TetrisDocument,
		private readonly renderer: Renderer,
	) {
		gameDocument.addListener(this)
	}

	notify(event: GameEvent) {
		if (event.type === 'nextTetramino') {
			this.tiles = event.data.newTiles
			this.render()
		}
	}

	render() {
		this.tiles.forEach(tileData => {
			if (tileData.tile) {
				const {color, x, y} = tileData.tile
				this.renderer.drawColoredQuad({x: x + this.offsetX, y: y + this.offsetY}, {width: 1, height: 1}, color)
			}
		})
	}
}

export {NextTetraminoView}
