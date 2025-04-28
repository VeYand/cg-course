const vertexShaderSource = `
	attribute float aX;
	
	void main() {
		float k = 0.8;
		float yOffset = -0.7;
	    float x = aX;
	    float R = (1.0 + sin(x)) * (1.0 + 0.9 * cos(8.0 * x)) * (1.0 + 0.1 * cos(24.0 * x)) * (0.5 + 0.05 * cos(140.0 * x));
	    float newX = R * cos(x);
	    float newY = R * sin(x);
	    gl_Position = vec4(newX * k, newY * k + yOffset, 0.0, 1.0);
	}
`


const fragmentShaderSource = `
	precision mediump float;

	void main() {
	    gl_FragColor = vec4(0.15, 0.65, 0.15, 1.0);
	}
`

export {
	vertexShaderSource,
	fragmentShaderSource,
}