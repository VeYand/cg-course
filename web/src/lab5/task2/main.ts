import {createShaderProgram} from '../../common/WebGLUtils'
import './index.css'
import {DIRECTION, Game} from './Arcanoid/Game'
import {fragmentShaderSource, vertexShaderSource} from './shaders'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private game: Game
	private handle: Map<DIRECTION, boolean> = new Map()

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
		this.program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
		this.game = new Game(gl, this.program)

		window.addEventListener('resize', this.resizeCanvas)
		window.addEventListener('keydown', this.onKeyDown)
		window.addEventListener('keyup', this.onKeyUp)
	}

	render = () => {
		[...this.handle.entries()].forEach(([direction, active]) => {
			if (active) {
				this.game.move(direction)
			}
		})
		this.game.render()
		requestAnimationFrame(this.render)
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight)
	}

	private onKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'a':
			case 'A':
			case 'ArrowLeft':
				this.handle.set(DIRECTION.LEFT, true)
				break
			case 'd':
			case 'D':
			case 'ArrowRight':
				this.handle.set(DIRECTION.RIGHT, true)
				break
		}
	}

	private onKeyUp = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'a':
			case 'A':
			case 'ArrowLeft':
				this.handle.set(DIRECTION.LEFT, false)
				break
			case 'd':
			case 'D':
			case 'ArrowRight':
				this.handle.set(DIRECTION.RIGHT, false)
				break
		}
	}
}

const app = new App()
requestAnimationFrame(app.render)
