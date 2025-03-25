import {DeltoidalIcositetrahedron} from './DeltoidalIcositetrahedron/DeltoidalIcositetrahedron'
import './index.css'
import {createShaderProgram} from './WebGLUtils'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private deltoidalIcositetrahedron: DeltoidalIcositetrahedron
	private then = 0
	private cubeRotation = 0

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
		this.deltoidalIcositetrahedron = new DeltoidalIcositetrahedron(gl, this.program)

		window.addEventListener('resize', this.resizeCanvas)
	}

	render = (now: number) => {
		now *= 0.0001
		const deltaTime = now - this.then
		this.then = now
		this.deltoidalIcositetrahedron.render(this.cubeRotation)
		this.cubeRotation += deltaTime
		requestAnimationFrame(this.render)
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight)
	}
}

const app = new App()
requestAnimationFrame(app.render)