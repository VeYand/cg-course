import {Renderable} from '../types'

class Sun implements Renderable {
	private buffer: WebGLBuffer | null = null
	private centerX = 3
	private centerY = 8
	private radius = 1
	private segments = 30


	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
	) {
		this.buffer = this.gl.createBuffer()
	}

	update() {
		this.centerY -= 0.001
		if (this.centerY < -2) {
			this.centerY = 8
		}
	}

	getSunHeight(): number {
		return ((this.centerY - (-2)) / (8 - (-2))) * 2 - 1
	}

	render() {
		const gl = this.gl
		const posLoc = gl.getAttribLocation(this.program, 'position')
		const colorLoc = gl.getUniformLocation(this.program, 'u_color')

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
		const vertices = this.getVertices()
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)
		gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(posLoc)
		gl.uniform4f(colorLoc, 1, 1, 0, 1)
		gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2)
	}

	private getVertices() {
		const vertices: number[] = []
		vertices.push(this.centerX, this.centerY)
		for (let i = 0; i <= this.segments; i++) {
			const angle = (i / this.segments) * 2 * Math.PI
			vertices.push(this.centerX + this.radius * Math.cos(angle), this.centerY + this.radius * Math.sin(angle))
		}
		return vertices
	}
}

export {
	Sun,
}