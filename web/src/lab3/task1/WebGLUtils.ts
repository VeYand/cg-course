const vertexShaderSource = `
  attribute vec2 position;
  uniform mat4 u_matrix;
  void main() {
    gl_Position = u_matrix * vec4(position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`

/** Компилирует шейдер указанного типа из source. */
function compileShader(
	gl: WebGLRenderingContext,
	type: number,
	source: string,
): WebGLShader {
	const shader = gl.createShader(type)
	if (!shader) {
		throw new Error('Не удалось создать шейдер')
	}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const err = gl.getShaderInfoLog(shader)
		gl.deleteShader(shader)
		throw new Error('Ошибка компиляции шейдера: ' + err)
	}
	return shader
}

/** Создаёт и линкует программу из вершинного и фрагментного шейдеров. */
function createShaderProgram(gl: WebGLRenderingContext): WebGLProgram {
	const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	const fragmentShader = compileShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource,
	)

	const program = gl.createProgram()
	if (!program) {
		throw new Error('Не удалось создать программу')
	}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const err = gl.getProgramInfoLog(program)
		throw new Error('Ошибка линковки программы: ' + err)
	}
	return program
}

/**
 * Вычисляет матрицу ортографической проекции с сохранением пропорций.
 * Зафиксированный «мир»: x от -5 до 5, y от -10 до 10.
 * При изменении окна добавляются поля (letterbox), чтобы график не искажался.
 */
function computeOrthoMatrix(
	canvasWidth: number,
	canvasHeight: number,
): Float32Array {
	// Задаём фиксированные границы мира.
	const worldLeft = -5
	const worldRight = 5
	const worldBottom = -10
	const worldTop = 10
	const worldWidth = worldRight - worldLeft // 10
	const worldHeight = worldTop - worldBottom // 20
	const worldAspect = worldWidth / worldHeight
	const canvasAspect = canvasWidth / canvasHeight

	let left = worldLeft,
		right = worldRight,
		bottom = worldBottom,
		top = worldTop

	// Если соотношение сторон окна больше, чем мира – добавляем поля по горизонтали.
	if (canvasAspect > worldAspect) {
		const newWorldWidth = worldHeight * canvasAspect
		const delta = (newWorldWidth - worldWidth) / 2
		left = worldLeft - delta
		right = worldRight + delta
	}
	else {
		// Иначе – добавляем поля по вертикали.
		const newWorldHeight = worldWidth / canvasAspect
		const delta = (newWorldHeight - worldHeight) / 2
		bottom = worldBottom - delta
		top = worldTop + delta
	}

	// Ортографическая матрица:
	const tx = -(right + left) / (right - left)
	const ty = -(top + bottom) / (top - bottom)
	const sx = 2 / (right - left)
	const sy = 2 / (top - bottom)

	// Записываем в столбцовый порядок:
	return new Float32Array([
		sx, 0, 0, 0,
		0, sy, 0, 0,
		0, 0, 1, 0,
		tx, ty, 0, 1,
	])
}

export {
	vertexShaderSource,
	fragmentShaderSource,
	createShaderProgram,
	computeOrthoMatrix,
}