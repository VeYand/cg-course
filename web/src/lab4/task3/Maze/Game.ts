import {mat4, vec3} from 'gl-matrix'
import {Maze} from './Maze'
import {Plane} from './Plane'

enum DIRECTION {
	FORWARD,
	BACKWARD,
	ROTATE_LEFT,
	ROTATE_RIGHT,
}

class Game {
	private readonly floor: Plane
	private readonly ceiling: Plane
	private readonly maze: Maze

	private cameraPos = vec3.fromValues(1, 0.5, 1)
	private cameraAngle = 0

	private moveSpeed = 0.05
	private turnSpeed = 0.03

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
	) {
		const floorColor = vec3.fromValues(0.0, 1.0, 0.0)
		const ceilingColor = vec3.fromValues(0.8, 0.8, 0.8)

		this.maze = new Maze(this.gl, this.shaderProgram)

		const centerX = (this.maze.getSize().mazeSize * this.maze.getSize().cellSize) / 2
		const centerZ = (this.maze.getSize().mazeSize * this.maze.getSize().cellSize) / 2

		this.floor = new Plane(this.gl, this.shaderProgram, floorColor, [centerX, 0, centerZ], this.maze.getSize().mazeSize * this.maze.getSize().cellSize, 'bottom')
		this.ceiling = new Plane(this.gl, this.shaderProgram, ceilingColor, [centerX, 1, centerZ], this.maze.getSize().mazeSize * this.maze.getSize().cellSize, 'top')
	}

	render(lightIntensity: number) {
		const gl = this.gl
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

		const lightDir = vec3.fromValues(0, 0, -lightIntensity)

		this.floor.render(viewMatrix, projectionMatrix, lightDir)
		this.ceiling.render(viewMatrix, projectionMatrix, lightDir)
		this.maze.render(viewMatrix, projectionMatrix, lightDir)
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
		const cellX = Math.floor(newPos[0])
		const cellZ = Math.floor(newPos[2])
		const mazeSize = this.maze.getSize().mazeSize

		if (cellX < 0 || cellX >= mazeSize || cellZ < 0 || cellZ >= mazeSize) {
			return false
		}

		return this.maze.isWalkable(cellX, cellZ)
	}
}

export {
	DIRECTION,
	Game,
}
