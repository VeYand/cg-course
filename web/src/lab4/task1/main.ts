import './index.css'
import {Rhombicosidodecahedron} from './Rhombicosidodecahedron/Rhombicosidodecahedron'
import {createShaderProgram} from './WebGLUtils'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private rhombicosidodecahedron: Rhombicosidodecahedron
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
		this.rhombicosidodecahedron = new Rhombicosidodecahedron(gl, this.program)

		window.addEventListener('resize', this.resizeCanvas)
	}

	render = (now: number) => {
		now *= 0.001 // convert to seconds
		const deltaTime = now - this.then
		this.then = now
		this.rhombicosidodecahedron.render(this.cubeRotation)
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