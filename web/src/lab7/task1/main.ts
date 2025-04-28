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
		const program = this.program

		gl.useProgram(program)

		const data: number[] = []
		for (let step = 0; step <= Math.PI * 2; step += (Math.PI / 1000)) {
			data.push(step)
		}

		const buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

		const aX = gl.getAttribLocation(program, 'aX')
		gl.enableVertexAttribArray(aX)
		gl.vertexAttribPointer(aX, 1, gl.FLOAT, false, 0, 0)

		gl.viewport(0, 0, this.canvas.width, this.canvas.height)
		gl.clearColor(0, 0, 0, 1)
		gl.clear(gl.COLOR_BUFFER_BIT)

		gl.drawArrays(gl.LINE_STRIP, 0, data.length)

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
