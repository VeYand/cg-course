const vertexShaderSource = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`


const fragmentShaderSource = `
precision mediump float;

uniform vec4 uColor;

void main() {
	gl_FragColor = uColor;
}
`

export {
	vertexShaderSource,
	fragmentShaderSource,
}