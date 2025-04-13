import {mat4, vec3} from 'gl-matrix'
import {loadTexture} from '../../../common/WebGLUtils'
import {Cube} from './Cube'
import {GLContext} from './GLContext'
import {Maze, WALL_TYPE} from './Maze'
import {Plane} from './Plane'

enum DIRECTION {
	FORWARD,
	BACKWARD,
	ROTATE_LEFT,
	ROTATE_RIGHT,
}

class Game {
	private readonly ctx: GLContext

	private floor?: Plane
	private maze?: Maze
	private skyBox?: Cube

	private cameraPos = vec3.fromValues(1, 0.5, 1)
	private cameraAngle = 0

	private moveSpeed = 0.025
	private turnSpeed = 0.015

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
				const maze = new Maze(this.ctx, {
					[WALL_TYPE.EMPTY]: brickWallTexture,
					[WALL_TYPE.BRICK]: brickWallTexture,
					[WALL_TYPE.BAD]: badWallTexture,
					[WALL_TYPE.CONCRETE]: concreteWallTexture,
					[WALL_TYPE.STONE]: stoneWallTexture,
					[WALL_TYPE.WHITE]: whiteWallTexture,
					[WALL_TYPE.MOULD]: mouldWallTexture,
				})
				this.maze = maze
				const centerX = (maze.getSize().mazeSize * maze.getSize().cellSize) / 2
				const centerZ = (maze.getSize().mazeSize * maze.getSize().cellSize) / 2

				this.floor = new Plane(this.ctx, grassTexture, [centerX, 0, centerZ], maze.getSize().mazeSize * maze.getSize().cellSize, 'bottom')
				this.skyBox = new Cube(this.ctx, skyTexture, [centerX, 0, centerZ], 100, false)
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
		const zFar = 100.0
		const projectionMatrix = mat4.create()
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

		const center = vec3.fromValues(
			this.cameraPos[0] + Math.sin(this.cameraAngle),
			this.cameraPos[1],
			this.cameraPos[2] + Math.cos(this.cameraAngle),
		)
		const up = vec3.fromValues(0, 1, 0)
		const viewMatrix = mat4.create()
		mat4.lookAt(viewMatrix, this.cameraPos, center, up)

		const lightWorldPosition = this.cameraPos
		const viewWorldPosition = this.cameraPos

		gl.useProgram(this.ctx.shaderProgram)

		gl.uniformMatrix4fv(
			this.ctx.projectionMatrixLocation,
			false,
			projectionMatrix,
		)
		gl.uniform3fv(
			this.ctx.lightWorldPositionLocation,
			lightWorldPosition,
		)
		gl.uniform3fv(
			this.ctx.viewWorldPositionLocation,
			viewWorldPosition,
		)

		this.floor?.render(viewMatrix)
		this.skyBox?.render(viewMatrix)
		this.maze?.render(viewMatrix)
	}

	move(direction: DIRECTION) {
		const newPos = vec3.clone(this.cameraPos)

		switch (direction) {
			case DIRECTION.FORWARD:
				newPos[0] += Math.sin(this.cameraAngle) * this.moveSpeed
				newPos[2] += Math.cos(this.cameraAngle) * this.moveSpeed
				break
			case DIRECTION.BACKWARD:
				newPos[0] -= Math.sin(this.cameraAngle) * this.moveSpeed
				newPos[2] -= Math.cos(this.cameraAngle) * this.moveSpeed
				break
			case DIRECTION.ROTATE_LEFT:
				this.cameraAngle += this.turnSpeed
				return
			case DIRECTION.ROTATE_RIGHT:
				this.cameraAngle -= this.turnSpeed
				return
		}

		if (this.canMoveTo(newPos)) {
			this.cameraPos = newPos
		}
	}

	private canMoveTo(newPos: vec3): boolean {
		if (!this.maze) {
			return false
		}
		const cellX = Math.floor(newPos[0])
		const cellZ = Math.floor(newPos[2])
		const mazeSize = this.maze.getSize().mazeSize

		if (cellX < 0 || cellX >= mazeSize || cellZ < 0 || cellZ >= mazeSize) {
			return false
		}

		return this.maze.isWalkable(cellX, cellZ)
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
			normalMatrixLocation: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
			samplerLocation: gl.getUniformLocation(shaderProgram, 'uSampler'),

			lightWorldPositionLocation: gl.getUniformLocation(shaderProgram, 'u_lightWorldPosition'),
			viewWorldPositionLocation: gl.getUniformLocation(shaderProgram, 'u_viewWorldPosition'),
			lightColorLocation: gl.getUniformLocation(shaderProgram, 'u_lightColor'),
			specularColorLocation: gl.getUniformLocation(shaderProgram, 'u_specularColor'),
			shininessLocation: gl.getUniformLocation(shaderProgram, 'u_shininess'),
			useLightLocation: gl.getUniformLocation(shaderProgram, 'uUseLight'),
		}
	}
}

export {
	DIRECTION,
	Game,
}
