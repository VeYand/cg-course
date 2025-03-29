import './index.css'
import {DIRECTION, Game} from './Maze/Game'
import {Settings} from './Settings/Settings'
import {createShaderProgram} from './WebGLUtils'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private game: Game

	private lightIntensity = 1

	constructor() {
		const settings = new Settings((intensity: number) => {
			this.lightIntensity = intensity
		})
		document.querySelector('#root')?.appendChild(settings.getElement())

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
		this.game = new Game(gl, this.program)

		window.addEventListener('resize', this.resizeCanvas)
		window.addEventListener('keydown', this.onKeyDown)
	}

	render = () => {
		this.game.render(this.lightIntensity)
		requestAnimationFrame(this.render)
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight)
	}

	private onKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'w':
			case 'W':
			case 'ArrowUp':
				this.game.move(DIRECTION.FORWARD)
				break
			case 's':
			case 'S':
			case 'ArrowDown':
				this.game.move(DIRECTION.BACKWARD)
				break
			case 'a':
			case 'A':
			case 'ArrowLeft':
				this.game.move(DIRECTION.ROTATE_LEFT)
				break
			case 'd':
			case 'D':
			case 'ArrowRight':
				this.game.move(DIRECTION.ROTATE_RIGHT)
				break
		}
	}
}

const app = new App()
requestAnimationFrame(app.render)
