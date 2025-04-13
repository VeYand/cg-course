import {mat4} from 'gl-matrix'
import {GLContext} from './GLContext'

class Plane {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly normalBuffer: WebGLBuffer | null
	private readonly texCoordBuffer: WebGLBuffer | null
	private readonly indexBuffer: WebGLBuffer | null
	private indicesCount = 0

	// eslint-disable-next-line max-params
	constructor(
		private readonly ctx: GLContext,
		private readonly texture: WebGLTexture,
		private readonly center: [number, number, number],
		private readonly width: number,
		private readonly type: 'top' | 'bottom',
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.normalBuffer = buffers.normal
		this.texCoordBuffer = buffers.texCoord
		this.indexBuffer = buffers.indices
	}

	// TODO использовать mid map чтобы убрать проблему с текстурами
	// TODO добавить освещение
	render(viewMatrix: mat4) {
		const gl = this.ctx.gl

		const modelMatrix = mat4.create()
		mat4.translate(modelMatrix, modelMatrix, this.center)

		const modelViewMatrix = mat4.create()
		mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix)

		const normalMatrix = mat4.create()
		mat4.invert(normalMatrix, modelMatrix)
		mat4.transpose(normalMatrix, normalMatrix)

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		this.setPositionAttribute()
		this.setNormalAttribute()
		this.setTexCoordAttribute()

		// Tell WebGL which indices to use to index the vertices
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
		gl.uniformMatrix4fv(
			this.ctx.normalMatrixLocation,
			false,
			normalMatrix,
		)

		gl.uniform3fv(
			this.ctx.lightColorLocation,
			[1.0, 0.6, 0.6],
		)
		gl.uniform3fv(
			this.ctx.specularColorLocation,
			[1.0, 0.6, 0.6],
		)
		gl.uniform1f(
			this.ctx.shininessLocation,
			32.0,
		)

		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.uniform1i(this.ctx.samplerLocation, 0)

		{
			const vertexCount = this.indicesCount
			const type = gl.UNSIGNED_SHORT
			const offset = 0
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
			// gl.disableVertexAttribArray(this.vertexTexCoord)
		}
	}

	private setPositionAttribute() {
		const gl = this.ctx.gl
		const numComponents = 3
		const type = gl.FLOAT // the data in the buffer is 32bit floats
		const normalize = false // don't normalize
		const stride = 0 // how many bytes to get from one set of values to the next
		// 0 = use type and numComponents above
		const offset = 0 // how many bytes inside the buffer to start from
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

	private setNormalAttribute() {
		const gl = this.ctx.gl
		const numComponents = 3
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
		gl.vertexAttribPointer(this.ctx.vertexNormal, numComponents, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(this.ctx.vertexNormal)
	}

	private setTexCoordAttribute() {
		const gl = this.ctx.gl
		if (this.ctx.vertexTexCoord < 0) {
			return
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)
		gl.vertexAttribPointer(this.ctx.vertexTexCoord, 2, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(this.ctx.vertexTexCoord)
	}

	private initBuffers() {
		const positionBuffer = this.initPositionBuffer()
		const normalBuffer = this.initNormalBuffer()
		const texCoordBuffer = this.initTexCoordBuffer()
		const indexBuffer = this.initIndexBuffer()

		return {
			position: positionBuffer,
			normal: normalBuffer,
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

	private initNormalBuffer(): WebGLBuffer | null {
		const gl = this.ctx.gl
		const normalBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
		const normals = this.getNormals()
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
		return normalBuffer
	}

	private initTexCoordBuffer(): WebGLBuffer | null {
		const gl = this.ctx.gl
		const texCoordBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
		const texCoords = [
			0, 0,
			1, 0,
			0, 1,
			1, 1,
			0, 0,
			1, 0,
			0, 1,
			1, 1,
		]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)
		return texCoordBuffer
	}

	private initIndexBuffer(): WebGLBuffer | null {
		const gl = this.ctx.gl

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
		const halfWidth = this.width / 2
		return [
			-halfWidth, 0, -halfWidth,
			-halfWidth, 0, halfWidth,
			halfWidth, 0, -halfWidth,
			halfWidth, 0, halfWidth,
		]
	}

	private getNormals(): number[] {
		const normal = this.type === 'top' ? [0, -1, 0] : [0, 1, 0]
		return [...normal, ...normal, ...normal, ...normal]
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
}

export {
	Plane,
}
