import {mat4} from 'gl-matrix'
import {GLContext} from './GLContext'

class Ball {
	private readonly positionBuffer: WebGLBuffer | null
	private readonly texCoordBuffer: WebGLBuffer | null
	private readonly indexBuffer: WebGLBuffer | null

	private indexCount = 0

	constructor(
		private readonly ctx: GLContext,
		private readonly texture: WebGLTexture,
		private readonly center: [number, number, number],
		private readonly size: number = 1,
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

		// Вычисляем матрицу модели-вида
		const modelViewMatrix = mat4.create()
		mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix)

		// Устанавливаем атрибуты позиции, цвета и нормали
		this.setPositionAttribute()
		this.setTexCoordAttribute()

		// Привязываем индексный буфер
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

		// Передаем матрицы в шейдер
		gl.uniformMatrix4fv(this.ctx.modelViewMatrixLocation, false, modelViewMatrix)
		gl.uniformMatrix4fv(this.ctx.modelMatrixLocation, false, modelMatrix)

		// Если используется текстурирование – привязываем текстуру
		gl.activeTexture(gl.TEXTURE0)
		gl.bindTexture(gl.TEXTURE_2D, this.texture)
		gl.uniform1i(this.ctx.samplerLocation, 0)

		{
			const vertexCount = this.indexCount
			const type = gl.UNSIGNED_SHORT
			const offset = 0
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
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
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer)
		gl.vertexAttribPointer(this.ctx.vertexTexCoord, 2, gl.FLOAT, false, 0, 0)
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
		const positions = this.getPositions()
		const numVertices = positions.length / 3
		const texCoords: number[] = []

		for (let i = 0; i < numVertices; i++) {
			const x = positions[i * 3]
			const y = positions[i * 3 + 1]
			const z = positions[i * 3 + 2]

			// @ts-expect-error
			const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI)
			// @ts-expect-error
			const v = 0.5 - Math.asin(y / this.size) / Math.PI

			texCoords.push(u, v)
		}

		const buffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)
		return buffer
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

		this.indexCount = indices.length
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
		return indexBuffer
	}


	private getPositions(): number[] {
		// https://en.wikipedia.org/wiki/Deltoidal_icositetrahedron
		const scale = this.size
		const a = (Math.sqrt(2) / 2) * scale
		const b = ((2 * Math.sqrt(2) + 1) / 7) * scale

		return [
			// Красные вершины
			-scale, 0, 0,
			scale, 0, 0,

			0, -scale, 0,
			0, scale, 0,

			0, 0, -scale,
			0, 0, scale,

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

export {
	Ball,
}
