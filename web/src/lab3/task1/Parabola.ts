import {WebGLContext} from './WebGLContext'


class Parabola {
	private readonly context: WebGLContext
	private vertexBuffer: WebGLBuffer | null = null
	private vertices: number[] = []
	private readonly scaleLocation: WebGLUniformLocation | null = null

	constructor(glContext: WebGLRenderingContext) {
		const program = this.createProgram(glContext)
		if (!program) {
			throw new Error('Не удалось создать программу')
		}

		this.context = {glContext, program}
		this.scaleLocation = glContext.getUniformLocation(program, 'u_scale')

		this.initVertexBuffer()
		this.updateScale()
	}

	render() {
		const gl = this.context.glContext
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)

		gl.useProgram(this.context.program)
		this.updateScale()
		gl.drawArrays(gl.LINE_STRIP, 0, this.vertices.length / 2)
	}

	private initVertexBuffer() {
		const vertices: number[] = []
		const step = 0.001
		const xMin = -2,
			xMax = 3

		for (let x = xMin; x <= xMax; x += step) {
			const y = 2 * x * x - 3 * x - 8
			vertices.push(x, y)
		}
		this.vertices = vertices

		const gl = this.context.glContext
		this.vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

		gl.useProgram(this.context.program)

		const positionLocation = gl.getAttribLocation(this.context.program, 'position')
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
	}

	private createProgram(gl: WebGLRenderingContext): WebGLProgram | undefined {
		const vertexShader = gl.createShader(gl.VERTEX_SHADER)
		if (!vertexShader) {
			return undefined
		}

		gl.shaderSource(vertexShader, `
			attribute vec2 position;
			uniform vec2 u_scale;
			void main() {
				vec2 scaledPosition = position * u_scale;
				gl_Position = vec4(scaledPosition, 0.0, 1.0);
			}
		`)
		gl.compileShader(vertexShader)

		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
		if (!fragmentShader) {
			return undefined
		}

		gl.shaderSource(fragmentShader, `
			void main() {
				gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			}
		`)
		gl.compileShader(fragmentShader)

		const program = gl.createProgram()
		if (!program) {
			return undefined
		}

		gl.attachShader(program, vertexShader)
		gl.attachShader(program, fragmentShader)
		gl.linkProgram(program)

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Ошибка связи программы:', gl.getProgramInfoLog(program))
			return undefined
		}

		return program
	}

	private updateScale() {
		const gl = this.context.glContext
		const canvas = gl.canvas as HTMLCanvasElement
		const aspectRatio = canvas.width / canvas.height

		if (this.scaleLocation) {
			gl.useProgram(this.context.program)
			gl.uniform2f(this.scaleLocation, 1 / 3, aspectRatio / 8)
		}
	}
}

export {Parabola}
