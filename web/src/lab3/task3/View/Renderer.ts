class Renderer {
	private positionBuffer: WebGLBuffer
	private texCoordBuffer: WebGLBuffer
	private gl: WebGLRenderingContext
	private program: WebGLProgram

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.gl = gl
		this.program = program
		const posBuffer = gl.createBuffer()
		if (!posBuffer) {
			throw new Error('Не удалось создать буфер для вершин')
		}
		this.positionBuffer = posBuffer

		const texBuffer = gl.createBuffer()
		if (!texBuffer) {
			throw new Error('Не удалось создать буфер для текстурных координат')
		}
		this.texCoordBuffer = texBuffer
	}

	drawColoredQuad(x: number, y: number, width: number, height: number, color: {r: number, g: number, b: number, a?: number}) {
		const gl = this.gl
		// Вычисляем вершины квадрата в мировых координатах
		const positions = new Float32Array([
			x, y,
			x + width, y,
			x, y + height,
			x + width, y + height,
		])
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
		const posLocation = gl.getAttribLocation(this.program, 'position')
		gl.enableVertexAttribArray(posLocation)
		gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0)

		// Передаём фиксированные текстурные координаты
		const texCoords = new Float32Array([
			0, 0,
			1, 0,
			0, 1,
			1, 1,
		])
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)
		const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord')
		gl.enableVertexAttribArray(texCoordLocation)
		gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

		// Устанавливаем uniform для цвета и отключаем текстуру
		const colorLocation = gl.getUniformLocation(this.program, 'u_color')
		gl.uniform4f(colorLocation, color.r / 255, color.g / 255, color.b / 255, color.a === undefined ? 1.0 : color.a)
		const useTextureLocation = gl.getUniformLocation(this.program, 'u_useTexture')
		gl.uniform1f(useTextureLocation, 0.0)

		// Отрисовываем квадрат
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	}

	drawTexturedQuad(x: number, y: number, width: number, height: number, texture: WebGLTexture) {
		const gl = this.gl
		const positions = new Float32Array([
			x, y,
			x + width, y,
			x, y + height,
			x + width, y + height,
		])
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
		const posLocation = gl.getAttribLocation(this.program, 'position')
		gl.enableVertexAttribArray(posLocation)
		gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0)

		const texCoords = new Float32Array([
			0, 0,
			1, 0,
			0, 1,
			1, 1,
		])
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)
		const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord')
		gl.enableVertexAttribArray(texCoordLocation)
		gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

		// Активируем и привязываем текстуру
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		const textureLocation = gl.getUniformLocation(this.program, 'u_texture')
		gl.uniform1i(textureLocation, 0)
		const useTextureLocation = gl.getUniformLocation(this.program, 'u_useTexture')
		gl.uniform1f(useTextureLocation, 1.0)

		// Устанавливаем значение цвета по умолчанию (не используется при текстурировании)
		const colorLocation = gl.getUniformLocation(this.program, 'u_color')
		gl.uniform4f(colorLocation, 1, 1, 1, 1)

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
	}
}

export {
	Renderer,
}