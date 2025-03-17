import {HORIZONTAL_DIRECTION, TetrisDocument} from '../Document/TetrisDocument'
import {NextTetraminoView} from './NextTetraminoView'
import {Renderer} from './Renderer'
import {ScoreView} from './ScoreView'
import {TetraminoField} from './TetraminoField'


class TetrisGame {
	private gameDocument: TetrisDocument
	private nextTetraminoView: NextTetraminoView
	private scoreView: ScoreView
	private tetraminoField: TetraminoField
	private renderer: Renderer
	private pauseOverlay: HTMLDivElement

	constructor(
		gl: WebGLRenderingContext,
		program: WebGLProgram,
	) {
		this.gameDocument = new TetrisDocument(20, 10)
		this.renderer = new Renderer(gl, program)
		this.nextTetraminoView = new NextTetraminoView(gl, program, this.gameDocument, this.renderer)
		this.scoreView = new ScoreView(gl, program, this.gameDocument, this.renderer)
		this.tetraminoField = new TetraminoField(this.gameDocument, this.renderer)
		this.pauseOverlay = this.createPauseOverlay()
		this.gameDocument.addListener({
			notify: event => {
				if (event.type === 'gameOver') {
					this.handleGameOver()
				}
			},
		})
		window.addEventListener('keydown', this.handleKeyDown)
	}

	render() {
		this.nextTetraminoView.render()
		this.scoreView.render()
		this.tetraminoField.render()
	}

	private createPauseOverlay() {
		const pauseOverlay = document.createElement('div')
		pauseOverlay.style.position = 'absolute'
		pauseOverlay.style.top = '50%'
		pauseOverlay.style.left = '50%'
		pauseOverlay.style.transform = 'translate(-50%, -50%)'
		pauseOverlay.style.color = 'white'
		pauseOverlay.style.fontSize = '48px'
		pauseOverlay.style.display = 'none'
		document.body.appendChild(pauseOverlay)
		return pauseOverlay
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		// if (e.key === 'p' || e.key === 'P') {
		// 	this.paused = !this.paused
		// 	this.pauseOverlay.style.display = this.paused ? 'block' : 'none'
		// 	return
		// }
		// if (this.paused) {
		// 	return
		// }
		switch (e.key) {
			case 'ArrowUp':
				this.gameDocument.rotateCurrentTetramino()
				break
			case 'ArrowLeft':
				this.gameDocument.moveCurrentTetramino(HORIZONTAL_DIRECTION.LEFT)
				break
			case 'ArrowRight':
				this.gameDocument.moveCurrentTetramino(HORIZONTAL_DIRECTION.RIGHT)
				break
			case 'ArrowDown':
				this.gameDocument.lowerTetramino()
				break
			default:
				break
		}
	}

	private handleGameOver() {
		this.showPauseOverlay('Игра окончена!')
		this.pauseOverlay.style.display = 'block'
	}

	private showPauseOverlay(text: string) {
		this.pauseOverlay.innerText = text
		this.pauseOverlay.style.display = 'block'
		setTimeout(() => {
			this.pauseOverlay.style.display = 'none'
			this.gameDocument.restartGame()
		}, 1000)
	}
}

export {TetrisGame}
