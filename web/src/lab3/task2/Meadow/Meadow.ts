import {Color, Renderable} from '../types'

class Meadow implements Renderable {
	private patches: {vertices: Float32Array, color: Color}[] = []

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
	) {
		this.initPatches()
	}


	render() {
		const gl = this.gl
		const posLoc = gl.getAttribLocation(this.program, 'position')
		const colorLoc = gl.getUniformLocation(this.program, 'u_color')
		for (const patch of this.patches) {
			const buffer = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, patch.vertices, gl.STATIC_DRAW)
			gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
			gl.enableVertexAttribArray(posLoc)
			gl.uniform4f(colorLoc, patch.color.r, patch.color.g, patch.color.b, patch.color.a)
			gl.drawArrays(gl.TRIANGLES, 0, patch.vertices.length / 2)
			gl.deleteBuffer(buffer)
		}
	}

	update(): void {
	}

	private initPatches() {
		const patchesInfo = [
			{x1: -5, x2: -2.5, color: {r: 0.2, g: 0.8, b: 0.2, a: 1}},
			{x1: -2.5, x2: 0, color: {r: 0.1, g: 0.7, b: 0.1, a: 1}},
			{x1: 0, x2: 2.5, color: {r: 0.3, g: 0.85, b: 0.3, a: 1}},
			{x1: 2.5, x2: 5, color: {r: 0.15, g: 0.75, b: 0.15, a: 1}},
		]
		for (const patch of patchesInfo) {
			const {x1, x2, color} = patch
			const vertices = new Float32Array([
				x1, -10, x2, -10, x1, 0,
				x1, 0, x2, -10, x2, 0,
			])
			this.patches.push({vertices, color})
		}
	}
}

export {
	Meadow,
}
