import {Color} from '../Color'
import {Position} from '../Position'

type IDrawStrategy = {
	draw: (gl: WebGLRenderingContext, program: WebGLProgram, position: Position, color: Color) => void,
}

const drawShape = (gl: WebGLRenderingContext, program: WebGLProgram, vertices: Float32Array, color: Color) => {
	const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
	const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

	gl.enableVertexAttribArray(positionAttributeLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

	gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

	gl.uniform4fv(colorUniformLocation, [color.r, color.g, color.b, 1])
	gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2)
}

class DrawStrategyTC implements IDrawStrategy {
	draw(gl: WebGLRenderingContext, program: WebGLProgram, position: Position, color: Color): void {
		const vertices = new Float32Array([
			position.x - 0.1, position.y + 0.5,
			position.x - 0.1, position.y - 0.5,
			position.x - 0.05, position.y + 0.5,

			position.x - 0.1, position.y - 0.5,
			position.x - 0.05, position.y - 0.5,
			position.x - 0.05, position.y + 0.5,

			position.x + 0.1, position.y + 0.5,
			position.x + 0.1, position.y - 0.5,
			position.x + 0.05, position.y + 0.5,

			position.x + 0.1, position.y - 0.5,
			position.x + 0.05, position.y - 0.5,
			position.x + 0.05, position.y + 0.5,

			position.x - 0.1, position.y - 0.5,
			position.x + 0.1, position.y - 0.5,
			position.x - 0.1, position.y - 0.45,

			position.x + 0.1, position.y - 0.5,
			position.x + 0.1, position.y - 0.45,
			position.x - 0.1, position.y - 0.45,
		])

		drawShape(gl, program, vertices, color)
	}
}

class DrawStrategyB implements IDrawStrategy {
	draw(gl: WebGLRenderingContext, program: WebGLProgram, position: Position, color: Color): void {
		const vertices = new Float32Array([
			position.x - 0.1, position.y + 0.5,
			position.x - 0.1, position.y - 0.5,
			position.x - 0.05, position.y + 0.5,

			position.x - 0.1, position.y - 0.5,
			position.x - 0.05, position.y - 0.5,
			position.x - 0.05, position.y + 0.5,

			position.x - 0.05, position.y + 0.5,
			position.x + 0.1, position.y + 0.5,
			position.x - 0.05, position.y + 0.3,

			position.x + 0.1, position.y + 0.5,
			position.x + 0.1, position.y + 0.3,
			position.x - 0.05, position.y + 0.3,

			position.x - 0.05, position.y + 0.1,
			position.x + 0.05, position.y + 0.1,
			position.x - 0.05, position.y + 0.05,

			position.x + 0.05, position.y + 0.1,
			position.x + 0.05, position.y + 0.05,
			position.x - 0.05, position.y + 0.05,

			position.x - 0.05, position.y + 0.05,
			position.x + 0.1, position.y + 0.05,
			position.x - 0.05, position.y - 0.5,

			position.x + 0.1, position.y + 0.05,
			position.x + 0.1, position.y - 0.5,
			position.x - 0.05, position.y - 0.5,
		])

		drawShape(gl, program, vertices, color)
	}
}

class DrawStrategyL implements IDrawStrategy {
	draw(gl: WebGLRenderingContext, program: WebGLProgram, position: Position, color: Color): void {
		const vertices = new Float32Array([
			position.x - 0.1, position.y - 0.5,
			position.x, position.y + 0.5,
			position.x - 0.05, position.y - 0.5,

			position.x, position.y + 0.5,
			position.x - 0.05, position.y - 0.5,
			position.x - 0.05, position.y + 0.45,

			position.x + 0.1, position.y - 0.5,
			position.x, position.y + 0.5,
			position.x + 0.05, position.y - 0.5,

			position.x, position.y + 0.5,
			position.x + 0.05, position.y - 0.5,
			position.x + 0.05, position.y + 0.45,
		])

		drawShape(gl, program, vertices, color)
	}
}


export type {
	IDrawStrategy,
}

export {
	DrawStrategyTC,
	DrawStrategyB,
	DrawStrategyL,
}
