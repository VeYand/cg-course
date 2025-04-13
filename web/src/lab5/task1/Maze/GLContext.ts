type GLContext = {
	gl: WebGLRenderingContext,
	shaderProgram: WebGLProgram,

	vertexPosition: number,
	vertexNormal: number,
	vertexTexCoord: number,

	projectionMatrixLocation: WebGLUniformLocation | null,
	modelViewMatrixLocation: WebGLUniformLocation | null,
	modelMatrixLocation: WebGLUniformLocation | null,
	normalMatrixLocation: WebGLUniformLocation | null,
	samplerLocation: WebGLUniformLocation | null,
	lightWorldPositionLocation: WebGLUniformLocation | null,
	viewWorldPositionLocation: WebGLUniformLocation | null,
	lightColorLocation: WebGLUniformLocation | null,
	specularColorLocation: WebGLUniformLocation | null,
	shininessLocation: WebGLUniformLocation | null,
	useLightLocation: WebGLUniformLocation | null,
}

export type {
	GLContext,
}