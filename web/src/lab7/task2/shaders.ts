const vertexShaderSource = `
attribute vec2 a_position;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;

void main() {
	float y = gl_FragCoord.y / u_resolution.y;
	
	if (y > 2.0 / 3.0)
	{
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	else if (y > 1.0 / 3.0)
	{
		gl_FragColor = vec4(0.0, 0.2, 0.6, 1.0);
	}
	else
	{
		gl_FragColor = vec4(0.8, 0.0, 0.0, 1.0);
	}
}
`


export {
	vertexShaderSource,
	fragmentShaderSource,
}