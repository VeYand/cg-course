import {mat4, vec3} from 'gl-matrix'
import {loadTexture} from '../../../common/WebGLUtils'
import {Cube} from './Cube'
import {Cubes, CUBE_TYPE} from './Cubes'
import {GLContext} from './GLContext'

enum DIRECTION {
	LEFT,
	RIGHT,
}

class Game {
	private readonly ctx: GLContext

	private floor?: Cube
	private maze?: Cubes
	private skyBox?: Cube

	private cameraPos = vec3.fromValues(8, 20, -8)
	private cameraCenter = vec3.fromValues(8, -12, 16)

	constructor(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
		this.ctx = this.initContext(gl, shaderProgram)

		const grassTexturePromise = loadTexture(this.ctx.gl, '/textures/grass.jpg')
		const skyTexturePromise = loadTexture(this.ctx.gl, '/textures/sky.jpg')

		const brickWallTexturePromise = loadTexture(this.ctx.gl, '/textures/brick.jpg')
		const badWallTexturePromise = loadTexture(this.ctx.gl, '/textures/bad.jpg')
		const concreteWallTexturePromise = loadTexture(this.ctx.gl, '/textures/concrete.jpg')
		const stoneWallTexturePromise = loadTexture(this.ctx.gl, '/textures/stone.jpg')
		const whiteWallTexturePromise = loadTexture(this.ctx.gl, '/textures/white.jpg')
		const mouldWallTexturePromise = loadTexture(this.ctx.gl, '/textures/mould.jpg')

		Promise.all([
			grassTexturePromise, skyTexturePromise, brickWallTexturePromise,
			badWallTexturePromise, concreteWallTexturePromise, stoneWallTexturePromise,
			whiteWallTexturePromise, mouldWallTexturePromise,
		])
			.then(([
				grassTexture, skyTexture, brickWallTexture,
				badWallTexture, concreteWallTexture, stoneWallTexture,
				whiteWallTexture, mouldWallTexture,
			]) => {
				const maze = new Cubes(this.ctx, {
					[CUBE_TYPE.EMPTY]: brickWallTexture,
					[CUBE_TYPE.BRICK]: brickWallTexture,
					[CUBE_TYPE.BAD]: badWallTexture,
					[CUBE_TYPE.CONCRETE]: concreteWallTexture,
					[CUBE_TYPE.STONE]: stoneWallTexture,
					[CUBE_TYPE.WHITE]: whiteWallTexture,
					[CUBE_TYPE.MOULD]: mouldWallTexture,
				}, [0, -5, 0])
				this.maze = maze
				const centerX = 16 / 2
				const centerZ = 24 / 2
				this.floor = new Cube(this.ctx, grassTexture, [centerX, -5.25, centerZ], {
					width: 16,
					height: 0.5,
					depth: 24,
				})
				this.skyBox = new Cube(this.ctx, skyTexture, [centerX, 0, centerZ], {
					width: 170,
					height: 80,
					depth: 170,
				})
			})
	}

	render() {
		const gl = this.ctx.gl
		gl.clearColor(0.0, 0.0, 0.0, 1.0)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		gl.enable(gl.DEPTH_TEST)
		gl.depthFunc(gl.LEQUAL)

		const fieldOfView = (45 * Math.PI) / 180
		const aspect = gl.canvas.width / gl.canvas.height
		const zNear = 0.1
		const zFar = 200.0
		const projectionMatrix = mat4.create()
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

		const up = vec3.fromValues(0, 1, 0)
		const viewMatrix = mat4.create()
		mat4.lookAt(viewMatrix, this.cameraPos, this.cameraCenter, up)

		gl.useProgram(this.ctx.shaderProgram)

		gl.uniformMatrix4fv(
			this.ctx.projectionMatrixLocation,
			false,
			projectionMatrix,
		)

		this.floor?.render(viewMatrix)
		this.skyBox?.render(viewMatrix)
		this.maze?.render(viewMatrix)
	}

	move(direction: DIRECTION) {
		// switch (direction) {
		// 	case DIRECTION.LEFT:
		// 		this.cameraAngle += this.sliderSpeed
		// 		return
		// 	case DIRECTION.RIGHT:
		// 		this.cameraAngle -= this.sliderSpeed
		// }
	}

	private initContext(gl: WebGLRenderingContext, shaderProgram: WebGLProgram): GLContext {
		return {
			gl: gl,
			shaderProgram: shaderProgram,

			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
			vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
			vertexTexCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),

			projectionMatrixLocation: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrixLocation: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
			modelMatrixLocation: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
			samplerLocation: gl.getUniformLocation(shaderProgram, 'uSampler'),
		}
	}
}

export {
	DIRECTION,
	Game,
}
