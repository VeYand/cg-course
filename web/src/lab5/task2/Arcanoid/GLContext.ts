type GLContext = {
	gl: WebGLRenderingContext,
	shaderProgram: WebGLProgram,

	vertexPosition: number,
	vertexNormal: number,
	vertexTexCoord: number,

	projectionMatrixLocation: WebGLUniformLocation | null,
	modelViewMatrixLocation: WebGLUniformLocation | null,
	modelMatrixLocation: WebGLUniformLocation | null,
	samplerLocation: WebGLUniformLocation | null,
}

type Size = {
	width: number,
	height: number,
	depth: number,
}

export type {
	GLContext,
	Size,
}