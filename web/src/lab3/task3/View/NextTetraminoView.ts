import {GameEvent} from '../Document/GameEvent'
import {IDocumentListener} from '../Document/IDocumentListener'
import {Color, TetrisDocument, TileData} from '../Document/TetrisDocument'
import {Renderer} from './Renderer'

class NextTetraminoView implements IDocumentListener {
	private tiles: TileData[] = []
	private readonly offsetXFromField = 2
	private readonly offsetYFromField = 17
	private offsetX: number
	private offsetY: number
	private width = 6
	private height = 6
	private readonly BORDER_COLOR: Color = {r: 255, g: 255, b: 255}

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
		private readonly gameDocument: TetrisDocument,
		private readonly renderer: Renderer,
	) {
		const filedSize = gameDocument.getSize()
		this.offsetX = filedSize.cols / 2 + this.offsetXFromField
		this.offsetY = -filedSize.rows / 2 + this.offsetYFromField
		gameDocument.addListener(this)
	}

	notify(event: GameEvent) {
		if (event.type === 'nextTetramino') {
			this.tiles = event.data.newTiles
		}
	}

	render() {
		this.drawBorders()
		this.tiles.forEach(tileData => {
			if (tileData.tile) {
				const {color, x, y} = tileData.tile
				console.log(x, y)
				this.renderer.drawColoredQuad({x: x + this.offsetX, y: y + this.offsetY}, {width: 1, height: 1}, color)
			}
		})
	}

	private drawBorders() {
		this.renderer.drawBorder(
			this.offsetX - this.width / 2,
			this.offsetY - this.height / 2,
			this.width,
			this.height,
			this.BORDER_COLOR,
		)
	}
}

export {
	NextTetraminoView,
}
