class Mandelbrot {
	areaW: [number, number] = [-2.0, 1.0]
	areaH: [number, number] = [-1.0, 1.0]
	maxIterations = 1000

	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private readonly positionBuffer: WebGLBuffer | null
	private readonly vertexLocation: number

	private readonly uniformLocations: {
		rectWidth: WebGLUniformLocation | null,
		rectHeight: WebGLUniformLocation | null,
		area_w: WebGLUniformLocation | null,
		area_h: WebGLUniformLocation | null,
		maxIterations: WebGLUniformLocation | null,
		texture: WebGLUniformLocation | null,
	}

	private paletteTexture: WebGLTexture | null = null

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.gl = gl
		this.program = program

		this.vertexLocation = gl.getAttribLocation(program, 'vertex_position')

		const vertices = new Float32Array([
			-1, -1, 0,
			1, -1, 0,
			1, 1, 0,
			-1, 1, 0,
		])

		this.positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

		this.uniformLocations = {
			rectWidth: gl.getUniformLocation(program, 'rect_width'),
			rectHeight: gl.getUniformLocation(program, 'rect_height'),
			area_w: gl.getUniformLocation(program, 'area_w'),
			area_h: gl.getUniformLocation(program, 'area_h'),
			maxIterations: gl.getUniformLocation(program, 'max_iterations'),
			texture: gl.getUniformLocation(program, 'palette_texture'),
		}
	}

	setPaletteImage(image: HTMLImageElement) {
		const gl = this.gl
		this.paletteTexture = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture)

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	}


	render(width: number, height: number) {
		const gl = this.gl
		gl.useProgram(this.program)
		gl.viewport(0, 0, width, height)
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT)

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.vertexAttribPointer(this.vertexLocation, 3, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(this.vertexLocation)

		gl.uniform1f(this.uniformLocations.rectWidth, width)
		gl.uniform1f(this.uniformLocations.rectHeight, height)
		gl.uniform2fv(this.uniformLocations.area_w, this.areaW)
		gl.uniform2fv(this.uniformLocations.area_h, this.areaH)
		gl.uniform1f(this.uniformLocations.maxIterations, this.maxIterations)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture)
		gl.uniform1i(this.uniformLocations.texture, 0)

		gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
	}
}

export {Mandelbrot}
