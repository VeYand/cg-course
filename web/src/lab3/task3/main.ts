import './index.css'
import {GameView} from './View/GameView'
import {createShaderProgram, computeOrthoMatrix} from './WebGLUtils'
import {TetrisDocument} from './Document/TetrisDocument'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private orthoMatrix: Float32Array
	private tetrisGame: GameView
	private lastUpdateTime: number
	private paused = false
	private pauseOverlay: HTMLDivElement

	constructor() {
		this.canvas = document.createElement('canvas')
		document.body.appendChild(this.canvas)
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		const gl = this.canvas.getContext('webgl')
		if (!gl) {
			throw new Error('WebGL не поддерживается')
		}
		this.gl = gl
		this.program = createShaderProgram(gl)
		gl.useProgram(this.program)
		this.orthoMatrix = computeOrthoMatrix(this.canvas.width, this.canvas.height)

		const gameDocument = new TetrisDocument(20, 10)
		this.tetrisGame = new GameView(gl, this.program, gameDocument)

		window.addEventListener('resize', this.resizeCanvas)
		window.addEventListener('keydown', this.handleKeyDown)

		gameDocument.addListener({
			notify: event => {
				if (event.type === 'gameOver') {
					this.handleGameOver()
				}
			},
		})

		// Создаём HTML-оверлей для паузы
		this.pauseOverlay = document.createElement('div')
		this.pauseOverlay.style.position = 'absolute'
		this.pauseOverlay.style.top = '50%'
		this.pauseOverlay.style.left = '50%'
		this.pauseOverlay.style.transform = 'translate(-50%, -50%)'
		this.pauseOverlay.style.color = 'white'
		this.pauseOverlay.style.fontSize = '48px'
		this.pauseOverlay.style.display = 'none'
		this.pauseOverlay.innerText = 'Paused'
		document.body.appendChild(this.pauseOverlay)

		this.lastUpdateTime = performance.now()
	}

	render = () => {
		requestAnimationFrame(this.render)
		const gl = this.gl

		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.COLOR_BUFFER_BIT)

		const matrixLocation = gl.getUniformLocation(this.program, 'u_matrix')
		gl.uniformMatrix4fv(matrixLocation, false, this.orthoMatrix)

		// Игровой тик – если игра не на паузе, двигаем фигуру вниз согласно dropSpeed
		if (!this.paused) {
			const now = performance.now()
			const dropSpeed = this.tetrisGame.document.getDropSpeed()
			if (now - this.lastUpdateTime > dropSpeed) {
				this.tetrisGame.document.moveCurrentTetramino(0, 1)
				this.lastUpdateTime = now
			}
		}

		this.tetrisGame.render()
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight)
		this.orthoMatrix = computeOrthoMatrix(window.innerWidth, window.innerHeight)
	}

	private handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'p' || e.key === 'P') {
			this.paused = !this.paused
			this.pauseOverlay.style.display = this.paused ? 'block' : 'none'
			return
		}
		if (this.paused) {
			return
		}
		switch (e.key) {
			case 'ArrowUp':
				this.tetrisGame.document.rotateCurrentTetramino()
				break
			case 'ArrowLeft':
				this.tetrisGame.document.moveCurrentTetramino(-1, 0)
				break
			case 'ArrowRight':
				this.tetrisGame.document.moveCurrentTetramino(1, 0)
				break
			case 'ArrowDown':
				this.tetrisGame.document.moveCurrentTetramino(0, 1)
				break
			default:
				break
		}
	}

	private handleGameOver() {
		this.paused = true
		this.pauseOverlay.style.display = 'block'
		setTimeout(() => {
			if (confirm('Игра окончена! Начать заново?')) {
				this.tetrisGame.document.restartGame()
				this.lastUpdateTime = performance.now()
				this.paused = false
				this.pauseOverlay.style.display = 'none'
			}
		}, 100)
	}
}

const app = new App()
app.render()
