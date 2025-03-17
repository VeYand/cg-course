import {GameEvent} from '../Document/GameEvent'
import {HORIZONTAL_DIRECTION, TetrisDocument} from '../Document/TetrisDocument'
import {NextTetraminoView} from './NextTetraminoView'
import {Renderer} from './Renderer'
import {ScoreView} from './ScoreView'
import {soundManager} from './SoundManager'
import {TetraminoField} from './TetraminoField'


class TetrisGame {
	private gameDocument: TetrisDocument
	private nextTetraminoView: NextTetraminoView
	private scoreView: ScoreView
	private tetraminoField: TetraminoField
	private renderer: Renderer
	private gameOverOverlay: HTMLDivElement
	private isGameActive = true

	constructor(
		gl: WebGLRenderingContext,
		program: WebGLProgram,
	) {
		this.gameDocument = new TetrisDocument(20, 10)
		this.renderer = new Renderer(gl, program)
		this.nextTetraminoView = new NextTetraminoView(this.gameDocument, this.renderer)
		this.scoreView = new ScoreView(gl, this.gameDocument, this.renderer)
		this.tetraminoField = new TetraminoField(this.gameDocument, this.renderer)
		this.gameOverOverlay = this.createGameOverOverlay()
		this.gameDocument.addListener(this)
		soundManager.play('main_theme')
		window.addEventListener('keydown', this.handleKeyDown)
	}

	render() {
		this.nextTetraminoView.render()
		this.scoreView.render()
		this.tetraminoField.render()
	}

	notify(event: GameEvent) {
		if (event.type === 'gameOver') {
			this.handleGameOver()
		}
		if (event.type === 'someTetraminoFixed') {
			soundManager.play('fix')
		}
	}

	private createGameOverOverlay() {
		const overlay = document.createElement('div')
		overlay.style.position = 'fixed'
		overlay.style.top = '0'
		overlay.style.left = '0'
		overlay.style.width = '100%'
		overlay.style.height = '100%'
		overlay.style.backgroundColor = 'rgba(0,0,0,0.7)'
		overlay.style.display = 'none'
		overlay.style.flexDirection = 'column'
		overlay.style.justifyContent = 'center'
		overlay.style.alignItems = 'center'
		overlay.style.color = 'white'

		const text = document.createElement('div')
		text.textContent = 'Game Over!'
		text.style.fontSize = '48px'
		text.style.marginBottom = '20px'

		const restartBtn = document.createElement('button')
		restartBtn.textContent = 'New Game'
		restartBtn.style.fontSize = '24px'
		restartBtn.onclick = () => this.restartGame()

		overlay.appendChild(text)
		overlay.appendChild(restartBtn)
		document.body.appendChild(overlay)
		return overlay
	}


	private handleKeyDown = (e: KeyboardEvent) => {
		if (!this.isGameActive) {
			return
		}

		switch (e.key) {
			case 'ArrowUp':
				this.gameDocument.rotateCurrentTetramino()
				soundManager.play('move')
				break
			case 'ArrowLeft':
				this.gameDocument.moveCurrentTetramino(HORIZONTAL_DIRECTION.LEFT)
				soundManager.play('move')
				break
			case 'ArrowRight':
				this.gameDocument.moveCurrentTetramino(HORIZONTAL_DIRECTION.RIGHT)
				soundManager.play('move')
				break
			case 'ArrowDown':
				this.gameDocument.lowerTetramino()
				soundManager.play('move')
				break
			default:
				break
		}
	}

	private handleGameOver() {
		this.isGameActive = false
		soundManager.stop('main_theme')
		soundManager.play('game_over')
		this.gameOverOverlay.style.display = 'flex'
	}

	private restartGame() {
		this.gameOverOverlay.style.display = 'none'
		this.gameDocument.restartGame()
		this.isGameActive = true
		soundManager.play('main_theme')
	}
}

export {TetrisGame}
