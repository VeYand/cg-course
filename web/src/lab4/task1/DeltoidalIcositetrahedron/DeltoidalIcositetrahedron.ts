import {mat4} from 'gl-matrix'

class DeltoidalIcositetrahedron {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly colorBuffer: WebGLBuffer | null
	private readonly indexBuffer: WebGLBuffer | null

	private readonly vertexPosition: number
	private readonly vertexColor: number
	private readonly projectionMatrix: WebGLUniformLocation | null
	private readonly modelViewMatrix: WebGLUniformLocation | null

	private indexCount = 0
	private positions: number[] = []

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.colorBuffer = buffers.color
		this.indexBuffer = buffers.indices

		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor')
		this.projectionMatrix = gl.getUniformLocation(
			shaderProgram,
			'uProjectionMatrix',
		)
		this.modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
	}

	render(cubeRotation: number) {
		const gl = this.gl
		gl.clearColor(0.0, 0.0, 0.0, 0.1) // Clear to black, fully opaque
		gl.clearDepth(1.0) // Clear everything
		gl.enable(gl.DEPTH_TEST) // Enable depth testing
		gl.depthFunc(gl.LEQUAL) // Near things obscure far things

		// Clear the canvas before we start drawing on it.

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = (45 * Math.PI) / 180 // in radians
		const aspect = gl.canvas.width / gl.canvas.height
		const zNear = 0.1
		const zFar = 100.0
		const projectionMatrix = mat4.create()

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = mat4.create()

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		mat4.translate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to translate
			[-0.0, 0.0, -6.0],
		) // amount to translate

		mat4.rotate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to rotate
			cubeRotation, // amount to rotate in radians
			[0, 0, 1],
		) // axis to rotate around (Z)
		mat4.rotate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to rotate
			cubeRotation * 0.7, // amount to rotate in radians
			[0, 1, 0],
		) // axis to rotate around (Y)
		mat4.rotate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to rotate
			cubeRotation * 0.3, // amount to rotate in radians
			[1, 0, 0],
		) // axis to rotate around (X)

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		this.setPositionAttribute()

		this.setColorAttribute()

		// Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

		// Tell WebGL to use our program when drawing
		gl.useProgram(this.shaderProgram)

		// Set the shader uniforms
		gl.uniformMatrix4fv(
			this.projectionMatrix,
			false,
			projectionMatrix,
		)
		gl.uniformMatrix4fv(
			this.modelViewMatrix,
			false,
			modelViewMatrix,
		)

		{
			const vertexCount = this.indexCount
			const type = gl.UNSIGNED_SHORT
			const offset = 0
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
		}
	}

	private setPositionAttribute() {
		const gl = this.gl
		const numComponents = 3
		const type = gl.FLOAT // the data in the buffer is 32bit floats
		const normalize = false // don't normalize
		const stride = 0 // how many bytes to get from one set of values to the next
		// 0 = use type and numComponents above
		const offset = 0 // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.vertexAttribPointer(
			this.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.vertexPosition)
	}

	// Tell WebGL how to pull out the colors from the color buffer
	// into the vertexColor attribute.
	private setColorAttribute() {
		const gl = this.gl
		const numComponents = 4
		const type = gl.FLOAT
		const normalize = false
		const stride = 0
		const offset = 0
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
		gl.vertexAttribPointer(
			this.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.vertexColor)
	}

	private initBuffers() {
		const positionBuffer = this.initPositionBuffer()
		const colorBuffer = this.initColorBuffer()
		const indexBuffer = this.initIndexBuffer()

		return {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer,
		}
	}

	private initPositionBuffer(): WebGLBuffer | null {
		const gl = this.gl
		// Create a buffer for the square's positions.
		const positionBuffer = gl.createBuffer()

		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

		// https://en.wikipedia.org/wiki/Deltoidal_icositetrahedron
		const a = Math.sqrt(2) / 2
		const b = (2 * Math.sqrt(2) + 1) / 7

		const positions: number[] = [
			// Красные вершины
			-1, 0, 0,
			1, 0, 0,

			0, -1, 0,
			0, 1, 0,

			0, 0, -1,
			0, 0, 1,

			// Синие вершины
			0, -a, -a,
			0, -a, a,
			0, a, -a,
			0, a, a,

			-a, 0, -a,
			-a, 0, a,
			a, 0, -a,
			a, 0, a,

			-a, -a, 0,
			-a, a, 0,
			a, -a, 0,
			a, a, 0,

			// Желтые вершины
			-b, -b, -b,
			-b, -b, b,
			-b, b, -b,
			-b, b, b,
			b, -b, -b,
			b, -b, b,
			b, b, -b,
			b, b, b,
		]

		this.positions = positions.slice()

		for (let i = 2; i < positions.length; i += 3) {
			console.log((i - 2) / 3, [positions[i - 2], positions[i - 1], positions[i]])
		}

		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		return positionBuffer
	}

	private initColorBuffer(): WebGLBuffer | null {
		const gl = this.gl
		const numVertices = this.positions.length / 3
		const colors: number[] = []
		for (let i = 0; i < numVertices; i++) {
			colors.push(Math.random(), Math.random(), Math.random(), 1.0)
		}
		const colorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

		return colorBuffer
	}

	private initIndexBuffer(): WebGLBuffer | null {
		const gl = this.gl

		const indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.
		const triangleFaces = [
			// Нижнее ложе
			[2, 6, 14], // 6 7 14 16
			[2, 14, 7],
			[2, 7, 16],
			[2, 16, 6],

			// Верхнее ложе
			[3, 8, 15], // 8 9 15 17
			[3, 15, 9],
			[3, 9, 17],
			[3, 17, 8],

			// Левое ложе
			[0, 10, 14], // 10 11 14 15
			[0, 14, 11],
			[0, 11, 15],
			[0, 15, 10],

			// Правое ложе
			[1, 12, 16], // 12 13 16 17
			[1, 16, 13],
			[1, 13, 17],
			[1, 17, 12],

			// Переднее ложе
			[5, 7, 11], // 7 9 11 13
			[5, 11, 9],
			[5, 9, 13],
			[5, 13, 7],

			// Заднее ложе
			[4, 6, 10], // 6 8 10 12
			[4, 10, 8],
			[4, 8, 12],
			[4, 12, 6],

			// Правое верхнее переднее ложе
			[25, 9, 13], // 9 13 17
			[25, 13, 17],
			[25, 17, 9],

			// Левое верхнее переднее ложе
			[21, 9, 11], // 9 11 15
			[21, 11, 15],
			[21, 15, 9],

			// Правое нижнее переднее ложе
			[23, 7, 13], // 7 13 16
			[23, 13, 16],
			[23, 16, 7],

			// Левое нижнее переднее ложе
			[19, 7, 11], // 7 11 14
			[19, 11, 14],
			[19, 14, 7],

			// Правое нижнее заднее ложе
			[22, 16, 12], // 16 12 6
			[22, 12, 6],
			[22, 6, 16],

			// Левое нижнее заднее ложе
			[18, 14, 10], // 14 10 6
			[18, 10, 6],
			[18, 6, 14],

			// Правое верхнее заднее ложе
			[24, 12, 17], // 12 17 8
			[24, 17, 8],
			[24, 8, 12],

			// Левое верхнее заднее ложе
			[20, 10, 15], // 10 15 8
			[20, 15, 8],
			[20, 8, 10],
		]

		const allFaces: number[][] = [...triangleFaces]
		// Преобразуем грани в массив индексов для отрисовки.
		// Для квадратов разобьём их на 2 треугольника.
		const indices: number[] = []
		for (const face of allFaces) {
			if (face.length === 3) {
				indices.push(...face)
			}
			else if (face.length === 4) {
				indices.push(face[0], face[1], face[2])
				indices.push(face[1], face[2], face[3])
			}
		}

		this.indexCount = indices.length
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
		return indexBuffer
	}
}

export {
	DeltoidalIcositetrahedron,
}