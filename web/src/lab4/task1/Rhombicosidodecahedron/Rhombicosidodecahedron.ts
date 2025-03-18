import {mat4} from 'gl-matrix'

class Rhombicosidodecahedron {
	private positionBuffer: WebGLBuffer | null
	private colorBuffer: WebGLBuffer | null
	private indexBuffer: WebGLBuffer | null


	private vertexPosition: number
	private vertexColor: number
	private projectionMatrix: WebGLUniformLocation | null
	private modelViewMatrix: WebGLUniformLocation | null

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
	) {
		const buffers = this.initBuffers()
		this.positionBuffer = buffers.position
		this.colorBuffer = buffers.color
		this.indexBuffer = buffers.indices

		this.vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
		this.vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor')
		this.projectionMatrix = gl.getUniformLocation(
			shaderProgram,
			'uProjectionMatrix',
		)
		this.modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
	}

	render(cubeRotation: number) {
		const gl = this.gl
		gl.clearColor(0.0, 0.0, 0.0, 1.0) // Clear to black, fully opaque
		gl.clearDepth(1.0) // Clear everything
		gl.enable(gl.DEPTH_TEST) // Enable depth testing
		gl.depthFunc(gl.LEQUAL) // Near things obscure far things

		// Clear the canvas before we start drawing on it.

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = (45 * Math.PI) / 180 // in radians
		const aspect = gl.canvas.width / gl.canvas.height
		const zNear = 0.1
		const zFar = 100.0
		const projectionMatrix = mat4.create()

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = mat4.create()

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		mat4.translate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to translate
			[-0.0, 0.0, -6.0],
		) // amount to translate

		mat4.rotate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to rotate
			cubeRotation, // amount to rotate in radians
			[0, 0, 1],
		) // axis to rotate around (Z)
		mat4.rotate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to rotate
			cubeRotation * 0.7, // amount to rotate in radians
			[0, 1, 0],
		) // axis to rotate around (Y)
		mat4.rotate(
			modelViewMatrix, // destination matrix
			modelViewMatrix, // matrix to rotate
			cubeRotation * 0.3, // amount to rotate in radians
			[1, 0, 0],
		) // axis to rotate around (X)

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		this.setPositionAttribute()

		this.setColorAttribute()

		// Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

		// Tell WebGL to use our program when drawing
		gl.useProgram(this.shaderProgram)

		// Set the shader uniforms
		gl.uniformMatrix4fv(
			this.projectionMatrix,
			false,
			projectionMatrix,
		)
		gl.uniformMatrix4fv(
			this.modelViewMatrix,
			false,
			modelViewMatrix,
		)

		{
			const vertexCount = 36
			const type = gl.UNSIGNED_SHORT
			const offset = 0
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
		}
	}

	private setPositionAttribute() {
		const gl = this.gl
		const numComponents = 3
		const type = gl.FLOAT // the data in the buffer is 32bit floats
		const normalize = false // don't normalize
		const stride = 0 // how many bytes to get from one set of values to the next
		// 0 = use type and numComponents above
		const offset = 0 // how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.vertexAttribPointer(
			this.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.vertexPosition)
	}

	// Tell WebGL how to pull out the colors from the color buffer
	// into the vertexColor attribute.
	private setColorAttribute() {
		const gl = this.gl
		const numComponents = 4
		const type = gl.FLOAT
		const normalize = false
		const stride = 0
		const offset = 0
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
		gl.vertexAttribPointer(
			this.vertexColor,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		)
		gl.enableVertexAttribArray(this.vertexColor)
	}

	private initBuffers() {
		const positionBuffer = this.initPositionBuffer()
		const colorBuffer = this.initColorBuffer()
		const indexBuffer = this.initIndexBuffer()

		return {
			position: positionBuffer,
			color: colorBuffer,
			indices: indexBuffer,
		}
	}

	private initPositionBuffer() {
		const gl = this.gl
		// Create a buffer for the square's positions.
		const positionBuffer = gl.createBuffer()

		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

		const positions = [
			// Front face
			-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

			// Back face
			-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

			// Top face
			-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

			// Right face
			1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

			// Left face
			-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
		]

		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

		return positionBuffer
	}

	private initColorBuffer() {
		const gl = this.gl

		const faceColors = [
			[1.0, 1.0, 1.0, 1.0], // Front face: white
			[1.0, 0.0, 0.0, 1.0], // Back face: red
			[0.0, 1.0, 0.0, 1.0], // Top face: green
			[0.0, 0.0, 1.0, 1.0], // Bottom face: blue
			[1.0, 1.0, 0.0, 1.0], // Right face: yellow
			[1.0, 0.0, 1.0, 1.0], // Left face: purple
		]

		// Convert the array of colors into a table for all the vertices.

		let colors = []

		for (let j = 0; j < faceColors.length; ++j) {
			const c = faceColors[j]
			// Repeat each color four times for the four vertices of the face
			colors = colors.concat(c, c, c, c)
		}

		const colorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

		return colorBuffer
	}

	private initIndexBuffer() {
		const gl = this.gl

		const indexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.

		const indices = [
			0,
			1,
			2,
			0,
			2,
			3, // front
			4,
			5,
			6,
			4,
			6,
			7, // back
			8,
			9,
			10,
			8,
			10,
			11, // top
			12,
			13,
			14,
			12,
			14,
			15, // bottom
			16,
			17,
			18,
			16,
			18,
			19, // right
			20,
			21,
			22,
			20,
			22,
			23, // left
		]

		// Now send the element array to GL

		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(indices),
			gl.STATIC_DRAW,
		)

		return indexBuffer
	}
}

export {
	Rhombicosidodecahedron,
}