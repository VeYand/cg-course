import {createShaderProgram} from '../../common/WebGLUtils'
import './index.css'
import {fragmentShaderSource, vertexShaderSource} from './shaders'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram

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

		window.addEventListener('resize', this.resizeCanvas)
	}

	render = () => {
		const gl = this.gl

		const positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				-1, -1,
				1, -1,
				-1, 1,
				-1, 1,
				1, -1,
				1, 1,
			]),
			gl.STATIC_DRAW,
		)

		const posLoc = gl.getAttribLocation(this.program, 'a_position')
		gl.enableVertexAttribArray(posLoc)
		gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

		const resolutionLoc = gl.getUniformLocation(this.program, 'u_resolution')
		gl.uniform2f(resolutionLoc, this.canvas.width, this.canvas.height)

		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.useProgram(this.program)

		gl.drawArrays(gl.TRIANGLES, 0, 6)

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
