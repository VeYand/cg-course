import {mat4} from 'gl-matrix'
import {GLContext, Size} from './GLContext'

class Cube {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly texCoordBuffer: WebGLBuffer | null
	private readonly indexBuffer: WebGLBuffer | null

	private indicesCount = 0

	constructor(
		private readonly ctx: GLContext,
		private readonly texture: WebGLTexture,
		private readonly center: [number, number, number],
		private readonly size: Size,
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.texCoordBuffer = buffers.texCoord
		this.indexBuffer = buffers.indices
	}

	render(viewMatrix: mat4) {
		const gl = this.ctx.gl

		const modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, this.center)

		const modelViewMatrix = mat4.create()
		mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix)

		this.setPositionAttribute()
		this.setTexCoordAttribute()

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

		gl.uniformMatrix4fv(
			this.ctx.modelViewMatrixLocation,
			false,
			modelViewMatrix,
		)
		gl.uniformMatrix4fv(
			this.ctx.modelMatrixLocation,
			false,
			modelMatrix,
		)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.uniform1i(this.ctx.samplerLocation, 0)

		{
			const vertexCount = this.indicesCount
			const type = gl.UNSIGNED_SHORT
			const offset = 0
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
			gl.disableVertexAttribArray(this.ctx.vertexTexCoord)
		}
	}

	private setPositionAttribute() {
		const gl = this.ctx.gl
		const numComponents = 3
		const type = gl.FLOAT
		const normalize = false
		const stride = 0
		const offset = 0
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.vertexAttribPointer(
			this.ctx.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.ctx.vertexPosition)
	}

	private setTexCoordAttribute() {
		const gl = this.ctx.gl
		if (this.ctx.vertexTexCoord < 0) {
			return
		}
		const numComponents = 2
		const type = gl.FLOAT
		const normalize = false
		const stride = 0
		const offset = 0
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)
		gl.vertexAttribPointer(this.ctx.vertexTexCoord, numComponents, type, normalize, stride, offset)
		gl.enableVertexAttribArray(this.ctx.vertexTexCoord)
	}

	private initBuffers() {
		const positionBuffer = this.initPositionBuffer()
		const texCoordBuffer = this.initTexCoordBuffer()
		const indexBuffer = this.initIndexBuffer()

		return {
			position: positionBuffer,
			texCoord: texCoordBuffer,
			indices: indexBuffer,
		}
	}

	private initPositionBuffer(): WebGLBuffer | null {
		const gl = this.ctx.gl
		const positionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		const positions = this.getPositions()
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
		return positionBuffer
	}

	private initTexCoordBuffer(): WebGLBuffer | null {
		const gl = this.ctx.gl
		const texCoordBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)

		const texCoords = [
			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,

			1.0, 1.0,
			1.0, 0.0,
			0.0, 0.0,
			0.0, 1.0,

			1.0, 1.0,
			1.0, 0.0,
			0.0, 0.0,
			0.0, 1.0,

			1.0, 1.0,
			1.0, 0.0,
			0.0, 0.0,
			0.0, 1.0,

			1.0, 1.0,
			1.0, 0.0,
			0.0, 0.0,
			0.0, 1.0,

			1.0, 1.0,
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,

		]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)
		return texCoordBuffer
	}

	private initIndexBuffer(): WebGLBuffer | null {
		const gl = this.ctx.gl
		const indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

		const triangleFaces = this.getTriangleFaces()

		const allFaces: number[][] = [...triangleFaces]
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
		const halfWidth = this.size.width / 2
		const halfHeight = this.size.height / 2
		const halfDepth = this.size.depth / 2

		return [
			-halfWidth, -halfHeight, halfDepth,
			halfWidth, -halfHeight, halfDepth,
			halfWidth, halfHeight, halfDepth,
			-halfWidth, halfHeight, halfDepth,

			-halfWidth, -halfHeight, -halfDepth,
			-halfWidth, halfHeight, -halfDepth,
			halfWidth, halfHeight, -halfDepth,
			halfWidth, -halfHeight, -halfDepth,

			-halfWidth, halfHeight, -halfDepth,
			-halfWidth, halfHeight, halfDepth,
			halfWidth, halfHeight, halfDepth,
			halfWidth, halfHeight, -halfDepth,

			-halfWidth, -halfHeight, -halfDepth,
			halfWidth, -halfHeight, -halfDepth,
			halfWidth, -halfHeight, halfDepth,
			-halfWidth, -halfHeight, halfDepth,

			halfWidth, -halfHeight, -halfDepth,
			halfWidth, halfHeight, -halfDepth,
			halfWidth, halfHeight, halfDepth,
			halfWidth, -halfHeight, halfDepth,

			-halfWidth, -halfHeight, -halfDepth,
			-halfWidth, -halfHeight, halfDepth,
			-halfWidth, halfHeight, halfDepth,
			-halfWidth, halfHeight, -halfDepth,
		]
	}


	private getTriangleFaces(): number[][] {
		return [
			[0, 1, 2],
			[0, 2, 3],
			[4, 5, 6],
			[4, 6, 7],
			[8, 9, 10],
			[8, 10, 11],

			[12, 13, 14],
			[12, 14, 15],
			[16, 17, 18],
			[16, 18, 19],
			[20, 21, 22],
			[20, 22, 23],
		]
	}
}

export {
	Cube,
}