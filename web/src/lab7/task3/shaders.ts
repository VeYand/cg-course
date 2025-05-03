const vertexShaderSource = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

const float PI = 3.141592653589793;

vec3 computeMobius(float u, float v) {
    float halfU = u * 0.5;
    float halfV = v * 0.5;
    float factor = 1.0 + halfV * cos(halfU);
    float x = factor * cos(u);
    float y = factor * sin(u);
    float z = halfV * sin(halfU);
    return vec3(x, y, z);
}

vec3 computeKlein(float u, float v) {
	v = (v + 1.0) * 2.0 * PI;

    float halfU = u * 0.5;
    float halfV = v * 0.5;
	
	float sinHalfU = sin(halfU);
	float cosHalfU = cos(halfU);
	float sinHalfV = sin(halfV);
	float cosHalfV = cos(halfV);
	
	float sinU = sin(u);
	float cosU = cos(u);
	float sinV = sin(v);
	float cosV = cos(v);
	
	float r = 2.0;
	
	float factor = (r + cosHalfU * sinV) - sinHalfU * sin(2.0 * v); 
	float x = factor * cosU;
	float y = factor * sinU;
	float z = sinHalfU * sinV + cosHalfU * sin(2.0 * v);

    return vec3(x, y, z);
}

void main(void) {
    float u = aVertexPosition.x;
    float v = aVertexPosition.y;
    
    vec3 mobiusPos = computeMobius(u, v);
    vec3 kleinPos = computeKlein(u, v);
    
    vec3 finalPos = mix(mobiusPos, kleinPos, uTime);
    
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(finalPos, 1.0);
}
`

const fragmentShaderSource = `
	precision mediump float;
	uniform vec4 uColor;
	void main() {
	    gl_FragColor = uColor;
	}
`

export {vertexShaderSource, fragmentShaderSource}