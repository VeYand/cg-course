type IDrawable = {
	draw: (gl: WebGLRenderingContext, program: WebGLProgram) => void,
}

export type {
	IDrawable,
}