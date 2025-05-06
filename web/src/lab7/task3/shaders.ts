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
    v *= (v + 1.0) * PI;

    float x, y, z;
    if (u < PI) {
        x = 3.0 * cos(u) * (1.0 + sin(u)) + (2.0 * (1.0 - cos(u)/2.0)) * cos(u) * cos(v);
        y = 8.0 * sin(u) + (2.0 * (1.0 - cos(u)/2.0)) * sin(u) * cos(v);
        z = (2.0 * (1.0 - cos(u)/2.0)) * sin(v);
    } else {
        x = 3.0 * cos(u) * (1.0 + sin(u)) + (2.0 * (1.0 - cos(u)/2.0)) * cos(v + PI);
        y = 8.0 * sin(u);
        z = (2.0 * (1.0 - cos(u)/2.0)) * sin(v);
    }
    
    return vec3(x/3.0, -y/3.0, z/3.0);
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
// x × (1 − a) + y × a.