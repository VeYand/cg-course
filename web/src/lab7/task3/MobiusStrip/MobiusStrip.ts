import {mat3, mat4, ReadonlyVec3} from 'gl-matrix'

class MobiusStrip {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly edgeBuffer: WebGLBuffer | null

	private readonly vertexPosition: number
	private readonly projectionMatrixLocation: WebGLUniformLocation | null
	private readonly modelViewMatrixLocation: WebGLUniformLocation | null
	private readonly colorLocation: WebGLUniformLocation | null


	private edgeCount = 0
	private readonly segmentsU = 100
	private readonly segmentsV = 5

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.edgeBuffer = buffers.edges
		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		this.projectionMatrixLocation = gl.getUniformLocation(
			shaderProgram,
			'uProjectionMatrix',
		)
		this.modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
		this.colorLocation = gl.getUniformLocation(shaderProgram, 'uColor')
	}

	render(cameraRotationX: number, cameraRotationY: number) {
		const gl = this.gl
		gl.clearColor(0.0, 0.0, 0.0, 0.1)
		gl.clearDepth(1.0)
		gl.enable(gl.DEPTH_TEST)
		gl.depthFunc(gl.LEQUAL)

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		const fieldOfView = (45 * Math.PI) / 180
		const aspect = gl.canvas.width / gl.canvas.height
		const zNear = 0.1
		const zFar = 100.0
		const projectionMatrix = mat4.create()

		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

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

		this.setPositionAttribute()

		gl.useProgram(this.shaderProgram)

		gl.uniform4f(
			this.colorLocation,
			0.2,
			0.8,
			0.2,
			1.0,
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

		{
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer)
			gl.drawElements(gl.LINES, this.edgeCount, gl.UNSIGNED_SHORT, 0)
		}
	}

	private setPositionAttribute() {
		const gl = this.gl
		const numComponents = 3
		const type = gl.FLOAT
		const normalize = false
		const stride = 0
		const offset = 0
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

	private initBuffers() {
		const positionBuffer = this.initPositionBuffer()
		const edgeBuffer = this.initEdgeBuffer()

		return {
			position: positionBuffer,
			edges: edgeBuffer,
		}
	}

	private initPositionBuffer(): WebGLBuffer | null {
		const gl = this.gl
		const positionBuffer = gl.createBuffer()

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

		const positions = this.getPositions()
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		return positionBuffer
	}

	private initEdgeBuffer(): WebGLBuffer | null {
		const gl = this.gl
		const edgeIndices: number[] = []
		const lineFaces = this.getLineFaces()
		lineFaces.forEach(item => {
			if (item.length === 2) {
				edgeIndices.push(...item)
			}
		})

		const edgeBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer)
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edgeIndices), gl.STATIC_DRAW)
		this.edgeCount = edgeIndices.length
		return edgeBuffer
	}

	// x(u,v) = (1 + v/2 * cos(u/2)) * cos(u)
	// y(u,v) = (1 + v/2 * cos(u/2)) * sin(u)
	// z(u,v) = (v/2) * sin(u/2)
	private getPositions(): number[] {
		const positions: number[] = []
		const vMin = -1
		const vMax = 1

		for (let i = 0; i <= this.segmentsU; i++) {
			const u = 2 * Math.PI * i / this.segmentsU
			const cosU = Math.cos(u)
			const sinU = Math.sin(u)
			const cosU2 = Math.cos(u / 2)
			const sinU2 = Math.sin(u / 2)
			for (let j = 0; j <= this.segmentsV; j++) {
				const v = vMin + ((vMax - vMin) * j) / this.segmentsV
				const factor = 1 + (v / 2) * cosU2
				const x = factor * cosU
				// const y = factor * sinU
				// const z = (v / 2) * sinU2
				const z = factor * sinU
				const y = -(v / 2) * sinU2
				positions.push(x, y, z)
			}
		}

		return positions
	}

	private getLineFaces(): number[][] {
		const lines: number[][] = []
		for (let i = 0; i <= this.segmentsU; i++) {
			for (let j = 0; j < this.segmentsV; j++) {
				const idx1 = i * (this.segmentsV + 1) + j
				const idx2 = i * (this.segmentsV + 1) + (j + 1)
				lines.push([idx1, idx2])
			}
		}
		for (let j = 0; j <= this.segmentsV; j++) {
			for (let i = 0; i < this.segmentsU; i++) {
				const idx1 = i * (this.segmentsV + 1) + j
				const idx2 = (i + 1) * (this.segmentsV + 1) + j
				lines.push([idx1, idx2])
			}
		}
		return lines
	}
}

export {
	MobiusStrip,
}