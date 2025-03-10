import {TetrisDocument} from '../Document/TetrisDocument'
import {Renderable} from '../types'
import {NextTetraminoView} from './NextTetraminoView'
import {Renderer} from './Renderer'
import {ScoreView} from './ScoreView'
import {TetraminoField} from './TetraminoField'

class GameView implements Renderable {
	private nextTetraminoView: NextTetraminoView
	private scoreView: ScoreView
	private tetraminoField: TetraminoField
	private renderer: Renderer

	constructor(
		gl: WebGLRenderingContext,
		program: WebGLProgram,
		gameDocument: TetrisDocument,
	) {
		this.renderer = new Renderer(gl, program)
		this.nextTetraminoView = new NextTetraminoView(gl, program, gameDocument, this.renderer)
		this.scoreView = new ScoreView(gl, program, gameDocument, this.renderer)
		this.tetraminoField = new TetraminoField(gl, program, gameDocument, this.renderer)
	}

	render() {
		this.tetraminoField.render()
		this.nextTetraminoView.render()
		this.scoreView.render()
	}
}

export {
	GameView,
}
