import {Letter} from './Letter/Letter'
import {DrawStrategyB, DrawStrategyL, DrawStrategyTC} from './Letter/Strategy/DrawStrategy'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gl = canvas.getContext('webgl')

if (!gl) {
	throw new Error('WebGL not supported')
}

const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 color;
    void main() {
        gl_FragColor = color;
    }
`

function createShader(_gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
	const shader = _gl.createShader(type)
	if (!shader) {
		throw new Error('Shader creating failed')
	}
	_gl.shaderSource(shader, source)
	_gl.compileShader(shader)
	if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
		console.error(_gl.getShaderInfoLog(shader))
		_gl.deleteShader(shader)
		throw new Error('Shader compilation failed')
	}
	return shader
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

const program = gl.createProgram()

if (!program) {
	throw new Error('WebGL program creating failed')
}

gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error(gl.getProgramInfoLog(program))
	throw new Error('Program linking failed')
}
gl.useProgram(program)

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

const positionAttributeLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionAttributeLocation)
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)


const render = () => {
	gl.clearColor(1, 1, 1, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)

	const letters = [
		new Letter({x: 0, y: 0}, {r: 1, g: 0, b: 0}, new DrawStrategyTC()),
		new Letter({x: 0.3, y: 0}, {r: 0, g: 1, b: 0}, new DrawStrategyB()),
		new Letter({x: -0.3, y: 0}, {r: 0, g: 0, b: 1}, new DrawStrategyL()),
	]

	for (const letter of letters) {
		letter.draw(gl, program)
	}
}

render()

export {}