import {mat3, mat4, ReadonlyVec3, vec3} from 'gl-matrix'

// TODO убрать ограничение , по прокрутке по X
class DeltoidalIcositetrahedron {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly colorBuffer: WebGLBuffer | null
	private readonly indexBuffer: WebGLBuffer | null
	private readonly normalBuffer: WebGLBuffer | null

	private readonly vertexPosition: number
	private readonly vertexColor: number
	private readonly projectionMatrix: WebGLUniformLocation | null
	private readonly modelViewMatrix: WebGLUniformLocation | null
	private readonly normalMatrixLocation: WebGLUniformLocation | null
	private readonly normalLocation: number

	private readonly reverseLightDirection: WebGLUniformLocation | null

	private indexCount = 0

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.colorBuffer = buffers.color
		this.indexBuffer = buffers.indices
		this.normalBuffer = buffers.normal

		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor')
		this.projectionMatrix = gl.getUniformLocation(
			shaderProgram,
			'uProjectionMatrix',
		)
		this.modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
		this.normalLocation = gl.getAttribLocation(shaderProgram, 'aNormal')
		this.normalMatrixLocation = gl.getUniformLocation(shaderProgram, 'uNormalMatrix')

		this.reverseLightDirection = gl.getUniformLocation(shaderProgram, 'uReverseLightDirection')
	}

	render(cameraRotationX: number, cameraRotationY: number, lightIntensity: number) {
		const gl = this.gl
		gl.clearColor(0.0, 0.0, 0.0, 0.0) // Clear to black, fully opaque
		// gl.clearDepth(0.0) // TODO выяснить
		gl.enable(gl.DEPTH_TEST) // Enable depth testing
		gl.depthFunc(gl.LEQUAL) //TODO выяснить, за что отвечает функция

		gl.enable(gl.CULL_FACE)// todo выяснить что делвет этот режим

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
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar) // TODO выяснить зачем нужны 2 отдельный матрицы проецирования и моделирования
		// TODO объяснить как реализовано вращение
		// Вычисляем положение камеры в сферических координатах
		const distance = 6.0
		const eye: ReadonlyVec3 = [
			distance * Math.cos(cameraRotationX) * Math.sin(cameraRotationY),
			distance * Math.sin(cameraRotationX),
			distance * Math.cos(cameraRotationX) * Math.cos(cameraRotationY),
		]
		const center: ReadonlyVec3 = [0, 0, 0]
		const up: ReadonlyVec3 = [0, 1, 0]

		const modelViewMatrix = mat4.create()
		mat4.lookAt(modelViewMatrix, eye, center, up)

		const normalMatrix = mat3.create()
		mat3.normalFromMat4(normalMatrix, modelViewMatrix)

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
			this.projectionMatrix,
			false,
			projectionMatrix,
		)
		gl.uniformMatrix4fv(
			this.modelViewMatrix,
			false,
			modelViewMatrix,
		)

		// set the light direction.
		const lightX = -1
		const lightY = 1
		const lightZ = 1
		gl.uniform3fv(this.reverseLightDirection, [lightX * lightIntensity, lightY * lightIntensity, lightZ * lightIntensity])

		// Отрисовка граней
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

	private setNormalAttribute() {
		const gl = this.gl
		const numComponents = 3
		const type = gl.FLOAT // the data in the buffer is 32bit floats
		const normalize = false // don't normalize
		const stride = 0 // how many bytes to get from one set of values to the next
		const offset = 0 // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
		gl.vertexAttribPointer(
			this.normalLocation,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.normalLocation)
	}

	private initBuffers() {
		const faceData = this.initFaceBuffers()

		const positionBuffer = this.initPositionBuffer(faceData.positions)

		const colorBuffer = this.initColorBuffer(faceData.colors)

		const indexBuffer = this.initIndexBuffer(faceData.indices)

		const normalBuffer = this.initNormalBuffer(faceData.normals)

		return {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer,
			normal: normalBuffer,
		}
	}

	private initFaceBuffers() {
		const triangleFaces = this.getTriangleFaces() // 48 треугольников
		const originalPositions = this.getPositions()
		const positions: number[] = []
		const colors: number[] = []
		const indices: number[] = []
		const normals: number[] = []

		const faceColors: [number, number, number, number][] = shuffleArray([
			[1.00, 0.00, 0.00, 1.0],
			[1.00, 0.30, 0.00, 1.0],
			[0.50, 1.00, 0.00, 1.0],
			[0.00, 0.85, 1.00, 1.0],
			[0.00, 0.70, 1.00, 1.0],
			[1.00, 0.15, 0.00, 1.0],
			[0.00, 0.55, 1.00, 1.0],
			[0.95, 1.00, 0.00, 1.0],
			[0.35, 1.00, 0.00, 1.0],
			[0.20, 1.00, 0.00, 1.0],
			[0.05, 1.00, 0.00, 1.0],
			[1.00, 0.00, 0.90, 1.0],
			[0.00, 1.00, 0.25, 1.0],
			[0.00, 1.00, 0.40, 1.0],
			[0.80, 1.00, 0.00, 1.0],
			[0.00, 0.40, 1.00, 1.0],
			[0.00, 0.25, 1.00, 1.0],
			[1.00, 0.75, 0.00, 1.0],
			[1.00, 0.90, 0.00, 1.0],
			[1.00, 0.00, 0.75, 1.0],
			[1.00, 0.00, 0.60, 1.0],
			[0.00, 1.00, 0.10, 1.0],
			[0.00, 1.00, 0.55, 1.0],
			[1.00, 0.45, 0.00, 1.0],
			[1.00, 0.60, 0.00, 1.0],
			[0.00, 1.00, 0.70, 1.0],
			[0.00, 1.00, 0.85, 1.0],
			[0.00, 1.00, 1.00, 1.0],
			[0.65, 0.00, 1.00, 1.0],
			[0.80, 0.00, 1.00, 1.0],
			[0.95, 0.00, 1.00, 1.0],
			[1.00, 0.00, 0.45, 1.0],
			[1.00, 0.00, 0.30, 1.0],
			[0.65, 1.00, 0.00, 1.0],
			[0.00, 0.10, 1.00, 1.0],
			[0.05, 0.00, 1.00, 1.0],
			[0.20, 0.00, 1.00, 1.0],
			[0.35, 0.00, 1.00, 1.0],
			[0.50, 0.00, 1.00, 1.0],
			[1.00, 0.00, 0.15, 1.0],
		])

		for (let i = 0; i < triangleFaces.length; i++) {
			const faceNumber = Math.floor(i / 2)
			const color = faceColors[faceNumber % faceColors.length]
			const triangle = triangleFaces[i]
			const baseIndex = positions.length / 3
			triangle?.forEach(idx => {
				positions.push(
					// @ts-expect-error
					originalPositions[idx * 3],
					originalPositions[idx * 3 + 1],
					originalPositions[idx * 3 + 2],
				)
				if (color) {
					colors.push(...color)
				}
			})
			indices.push(baseIndex, baseIndex + 1, baseIndex + 2)

			const posLen = positions.length
			// @ts-expect-error
			const p0 = vec3.fromValues(positions[posLen - 9], positions[posLen - 8], positions[posLen - 7])
			// @ts-expect-error
			const p1 = vec3.fromValues(positions[posLen - 6], positions[posLen - 5], positions[posLen - 4])
			// @ts-expect-error
			const p2 = vec3.fromValues(positions[posLen - 3], positions[posLen - 2], positions[posLen - 1])
			const v1 = vec3.create(),
				v2 = vec3.create()
			vec3.subtract(v1, p1, p0)
			vec3.subtract(v2, p2, p0)
			const normal = vec3.create()
			vec3.cross(normal, v1, v2)
			vec3.normalize(normal, normal)
			for (let j = 0; j < 3; j++) {
				normals.push(normal[0], normal[1], normal[2])
			}
		}

		return {positions, colors, indices, normals}
	}

	private initPositionBuffer(positions: number[]): WebGLBuffer | null {
		const gl = this.gl
		const positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		return positionBuffer
	}

	private initColorBuffer(colors: number[]): WebGLBuffer | null {
		const gl = this.gl
		const colorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

		return colorBuffer
	}

	private initIndexBuffer(indices: number[]): WebGLBuffer | null {
		const gl = this.gl
		const indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
		this.indexCount = indices.length
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
		return indexBuffer
	}

	private initNormalBuffer(normals: number[]): WebGLBuffer | null {
		const gl = this.gl
		const normalBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
		return normalBuffer
	}

	private getPositions(): number[] {
		// https://en.wikipedia.org/wiki/Deltoidal_icositetrahedron
		const a = Math.sqrt(2) / 2
		const b = (2 * Math.sqrt(2) + 1) / 7

		return [
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
	}

	private getTriangleFaces(): number[][] {
		return [
			[11, 0, 14],
			[11, 14, 19],

			[10, 18, 14],
			[10, 14, 0],

			[11, 15, 0],
			[11, 21, 15],

			[10, 0, 15],
			[10, 15, 20],

			[7, 19, 14],
			[7, 14, 2],

			[6, 2, 14],
			[6, 14, 18],

			[9, 15, 21],
			[9, 3, 15],

			[8, 20, 15],
			[8, 15, 3],

			[7, 11, 19],
			[7, 5, 11],

			[6, 18, 10],
			[6, 10, 4],

			[9, 21, 11],
			[9, 11, 5],

			[8, 4, 10],
			[8, 10, 20],

			[13, 23, 16],
			[13, 16, 1],

			[13, 1, 17],
			[13, 17, 25],

			[13, 25, 9],
			[13, 9, 5],

			[13, 5, 7],
			[13, 7, 23],

			[12, 1, 16],
			[12, 16, 22],

			[12, 24, 17],
			[12, 17, 1],

			[12, 4, 8],
			[12, 8, 24],

			[12, 22, 6],
			[12, 6, 4],

			[9, 25, 17],
			[9, 17, 3],

			[7, 2, 16],
			[7, 16, 23],

			[8, 3, 17],
			[8, 17, 24],

			[6, 22, 16],
			[6, 16, 2],
		]
	}
}

const shuffleArray = <T>(array: T[]): T[] => {
	const newArray = array.slice()
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// @ts-expect-error
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}
	return newArray
}

export {
	DeltoidalIcositetrahedron,
}