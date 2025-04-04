import {mat4, vec3} from 'gl-matrix'

class Cube {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly colorBuffer: WebGLBuffer | null
	private readonly edgeBuffer: WebGLBuffer | null
	private readonly indexBuffer: WebGLBuffer | null

	private readonly vertexPosition: number
	private readonly vertexColor: number
	private readonly projectionMatrixLocation: WebGLUniformLocation | null
	private readonly modelViewMatrixLocation: WebGLUniformLocation | null

	private edgeCount = 0
	private indicesCount = 0
	private positions: number[] = []

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
		private readonly color: vec3,
		private readonly center: [number, number, number],
		private readonly size: number,
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.colorBuffer = buffers.color
		this.indexBuffer = buffers.indices
		this.edgeBuffer = buffers.edges

		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor')
		this.projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
		this.modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
	}

	render(viewMatrix: mat4, projectionMatrix: mat4) {
		const gl = this.gl

		const modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, this.center)

		const modelViewMatrix = mat4.create()
		mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix)

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
			this.projectionMatrixLocation,
			false,
			projectionMatrix,
		)
		gl.uniformMatrix4fv(
			this.modelViewMatrixLocation,
			false,
			modelViewMatrix,
		)

		// Отрисовка граней
		{
			const vertexCount = this.indicesCount
			const type = gl.UNSIGNED_SHORT
			const offset = 0
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
		}

		// Отрисовка рёбер
		{
			gl.disableVertexAttribArray(this.vertexColor)
			gl.vertexAttrib4f(this.vertexColor, 0, 0, 0, 1)
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer)
			gl.drawElements(gl.LINES, this.edgeCount, gl.UNSIGNED_SHORT, 0)
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
		const edgeBuffer = this.initEdgeBuffer()

		return {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer,
			edges: edgeBuffer,
		}
	}

	private initPositionBuffer(): WebGLBuffer | null {
		const gl = this.gl
		// Create a buffer for the square's positions.
		const positionBuffer = gl.createBuffer()

		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

		const positions = this.getPositions()
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
			colors.push(this.color[0], this.color[1], this.color[2], 1.0)
		}
		const colorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

		return colorBuffer
	}

	private initEdgeBuffer(): WebGLBuffer | null {
		const gl = this.gl
		const edgeIndices: number[] = []
		this.getLineFaces().forEach(item => {
			if (item.length > 1) {
				// @ts-expect-error
				edgeIndices.push(item[0], item[1])
			}
		})

		const edgeBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edgeIndices), gl.STATIC_DRAW)
		this.edgeCount = edgeIndices.length
		return edgeBuffer
	}

	private initIndexBuffer(): WebGLBuffer | null {
		const gl = this.gl

		const indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.
		const triangleFaces = this.getTriangleFaces()

		const allFaces: number[][] = [...triangleFaces]
		// Преобразуем грани в массив индексов для отрисовки.
		// Для квадратов разобьём их на 2 треугольника.
		const indices: number[] = []
		for (const face of allFaces) {
			if (face.length === 3) {
				indices.push(...face)
			}
		}

		this.indicesCount = indices.length
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
		return indexBuffer
	}

	private getPositions(): number[] {
		const half = this.size / 2
		return [
			-half, -half, -half,
			-half, -half, half,
			-half, half, -half,
			-half, half, half,
			half, -half, -half,
			half, -half, half,
			half, half, -half,
			half, half, half,
		]
	}

	private getTriangleFaces(): number[][] {
		return [
			[0, 2, 3],
			[0, 3, 1],
			[0, 6, 2],
			[0, 4, 6],
			[0, 4, 5],
			[0, 5, 1],

			[7, 6, 2],
			[7, 2, 3],
			[7, 3, 1],
			[7, 1, 5],
			[7, 5, 4],
			[7, 4, 6],
		]
	}

	private getLineFaces(): number[][] {
		return [
			[0, 1],
			[2, 3],
			[4, 5],
			[6, 7],

			[0, 4],
			[1, 5],
			[2, 6],
			[3, 7],

			[0, 2],
			[1, 3],
			[4, 6],
			[5, 7],
			[6, 4],
		]
	}
}

export {
	Cube,
}