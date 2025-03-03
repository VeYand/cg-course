class Axes {
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram

	// Буферы для разных элементов осей.
	private axesBuffer: WebGLBuffer | null = null
	private ticksBuffer: WebGLBuffer | null = null
	private arrowBuffer: WebGLBuffer | null = null

	// Число вершин для каждого набора
	private axesVertexCount = 0
	private ticksVertexCount = 0
	private arrowVertexCount = 0

	constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
		this.gl = gl
		this.program = program
		this.initBuffers()
	}

	render() {
		const gl = this.gl
		const positionLocation = gl.getAttribLocation(this.program, 'position')

		// Устанавливаем цвет осей – зелёный.
		const colorLocation = gl.getUniformLocation(this.program, 'u_color')
		gl.uniform4f(colorLocation, 0, 1, 0, 1)

		// Рисуем главные оси (линии)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.axesBuffer)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
		gl.drawArrays(gl.LINES, 0, this.axesVertexCount)

		// Рисуем деления (ticks)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.ticksBuffer)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
		gl.drawArrays(gl.LINES, 0, this.ticksVertexCount)

		// Рисуем стрелки (используем GL.TRIANGLES)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowBuffer)
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(positionLocation)
		gl.drawArrays(gl.TRIANGLES, 0, this.arrowVertexCount)
	}

	private initBuffers() {
		const gl = this.gl

		// 1. Главные оси: линия X (от -5 до 5) и Y (от -10 до 10).
		const axesVertices = new Float32Array([
			-5, 0, 5, 0,    // ось X
			0, -10, 0, 10,   // ось Y
		])
		this.axesVertexCount = axesVertices.length / 2
		this.axesBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.axesBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, axesVertices, gl.STATIC_DRAW)

		// 2. Деления (ticks):
		// Для оси X: деления через 1 единицу от -5 до 5 (вертикальные короткие отрезки)
		const tickSize = 0.2
		const xTicks: number[] = []
		for (let x = -5; x <= 5; x += 1) {
			xTicks.push(x, -tickSize, x, tickSize)
		}
		// Для оси Y: деления через 1 единицу от -10 до 10 (горизонтальные отрезки)
		const yTicks: number[] = []
		for (let y = -10; y <= 10; y += 1) {
			yTicks.push(-tickSize, y, tickSize, y)
		}
		const ticksVertices = new Float32Array([...xTicks, ...yTicks])
		this.ticksVertexCount = ticksVertices.length / 2
		this.ticksBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.ticksBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, ticksVertices, gl.STATIC_DRAW)

		// 3. Стрелки (arrowheads) для осей:
		// Стрелка оси X (треугольник у (5,0))
		const arrowX = [
			5, 0,
			4.8, 0.1,
			4.8, -0.1,
		]
		// Стрелка оси Y (треугольник у (0,10))
		const arrowY = [
			0, 10,
			0.1, 9.8,
			-0.1, 9.8,
		]
		const arrowVertices = new Float32Array([...arrowX, ...arrowY])
		this.arrowVertexCount = arrowVertices.length / 2
		this.arrowBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.arrowBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, arrowVertices, gl.STATIC_DRAW)
	}
}

export {
	Axes,
}