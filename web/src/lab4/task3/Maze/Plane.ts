import {mat4, mat3, vec3} from 'gl-matrix'

class Plane {
	private positionBuffer: WebGLBuffer | null = null
	private colorBuffer: WebGLBuffer | null = null
	private readonly edgeBuffer: WebGLBuffer | null
	private normalBuffer: WebGLBuffer | null = null
	private indexBuffer: WebGLBuffer | null = null

	private vertexPosition: number
	private vertexColor: number
	private vertexNormal: number
	private projectionMatrixLocation: WebGLUniformLocation | null
	private modelViewMatrixLocation: WebGLUniformLocation | null
	private normalMatrixLocation: WebGLUniformLocation | null
	private lightPosLocation: WebGLUniformLocation | null

	private edgeCount = 0
	private indicesCount = 0
	private positions: number[] = []

	// eslint-disable-next-line max-params
	constructor(
		private gl: WebGLRenderingContext,
		private shaderProgram: WebGLProgram,
		private color: vec3,
		private center: [number, number, number],
		private width: number,
		private type: 'top' | 'bottom',
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.colorBuffer = buffers.color
		this.indexBuffer = buffers.indices
		this.edgeBuffer = buffers.edges
		this.normalBuffer = buffers.normal

		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor')
		this.vertexNormal = gl.getAttribLocation(shaderProgram, 'aNormal')
		this.projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
		this.modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
		this.normalMatrixLocation = gl.getUniformLocation(shaderProgram, 'uNormalMatrix')
		this.lightPosLocation = gl.getUniformLocation(shaderProgram, 'uLightDir')
	}

	render(viewMatrix: mat4, projectionMatrix: mat4, lightDir: vec3) {
		const gl = this.gl

		const modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, this.center)
		const modelViewMatrix = mat4.create()
		mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix)

		const normalMatrix = mat3.create()
		mat3.fromMat4(normalMatrix, modelViewMatrix)
		mat3.invert(normalMatrix, normalMatrix)
		mat3.transpose(normalMatrix, normalMatrix)

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		this.setPositionAttribute()

		this.setColorAttribute()

		this.setNormalAttribute()

		// Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

		// Tell WebGL to use our program when drawing
		gl.useProgram(this.shaderProgram)

		// Set the shader uniforms
		gl.uniformMatrix3fv(
			this.normalMatrixLocation,
			false,
			normalMatrix,
		)
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

		gl.uniform3fv(
			this.lightPosLocation,
			lightDir,
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

	private setNormalAttribute() {
		const gl = this.gl
		const numComponents = 3
		const type = gl.FLOAT // the data in the buffer is 32bit floats
		const normalize = false // don't normalize
		const stride = 0 // how many bytes to get from one set of values to the next
		const offset = 0 // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
		gl.vertexAttribPointer(
			this.vertexNormal,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.vertexNormal)
	}

	private initBuffers() {
		const positionBuffer = this.initPositionBuffer()
		const colorBuffer = this.initColorBuffer()
		const indexBuffer = this.initIndexBuffer()
		const edgeBuffer = this.initEdgeBuffer()
		const normal = this.initNormalBuffer()

		return {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer,
			edges: edgeBuffer,
			normal: normal,
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

	private initNormalBuffer(): WebGLBuffer | null {
		const gl = this.gl
		const positions = this.getPositions()
		const normals = this.computeNormals(positions, this.getTriangleFaces())
		const normalBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
		return normalBuffer
	}

	private computeNormals(positions: number[], faces: number[][]): number[] {
		const numVertices = positions.length / 3
		const normals = new Array(numVertices * 3).fill(1)

		faces.forEach(face => {
			if (face.length === 3) {
				// @ts-expect-error
				const idx0 = face[0] * 3
				// @ts-expect-error
				const idx1 = face[1] * 3
				// @ts-expect-error
				const idx2 = face[2] * 3

				// @ts-expect-error
				const p0 = vec3.fromValues(positions[idx0], positions[idx0 + 1], positions[idx0 + 2])
				// @ts-expect-error
				const p1 = vec3.fromValues(positions[idx1], positions[idx1 + 1], positions[idx1 + 2])
				// @ts-expect-error
				const p2 = vec3.fromValues(positions[idx2], positions[idx2 + 1], positions[idx2 + 2])

				const v1 = vec3.create()
				const v2 = vec3.create()
				vec3.subtract(v1, p1, p0)
				vec3.subtract(v2, p2, p0)

				const normal = vec3.create()
				vec3.cross(normal, v1, v2)
				vec3.normalize(normal, normal)

				for (const idx of face) {
					normals[idx * 3] += normal[0]
					normals[idx * 3 + 1] += normal[1]
					normals[idx * 3 + 2] += normal[2]
				}
			}
		})

		for (let i = 0; i < numVertices; i++) {
			const nx = normals[i * 3]
			const ny = normals[i * 3 + 1]
			const nz = normals[i * 3 + 2]
			const len = Math.hypot(nx, ny, nz)
			if (len > 0) {
				normals[i * 3] = nx / len
				normals[i * 3 + 1] = ny / len
				normals[i * 3 + 2] = nz / len
			}
		}

		return normals
	}

	private getPositions(): number[] {
		const halfWidth = this.width / 2
		return [
			-halfWidth, 0, -halfWidth,
			-halfWidth, 0, halfWidth,
			halfWidth, 0, -halfWidth,
			halfWidth, 0, halfWidth,
		]
	}

	private getTriangleFaces(): number[][] {
		if (this.type === 'top') {
			return [
				[0, 2, 1],
				[2, 3, 1],
			]
		}

		return [
			[0, 1, 2],
			[2, 1, 3],
		]
	}

	private getLineFaces(): number[][] {
		return [
			[0, 1],
			[2, 3],
			[0, 2],
			[1, 3],
		]
	}
}

export {
	Plane,
}