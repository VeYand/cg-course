const vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec2 aTextureCoord;

	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	varying highp vec2 vTextureCoord;

	void main(void) {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		vTextureCoord = aTextureCoord;
	}
`

const fragmentShaderSource = `
	precision mediump float;
	varying highp vec2 vTextureCoord;

	uniform sampler2D uSampler;

	void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
	}
`
export {
	vertexShaderSource,
	fragmentShaderSource,
}