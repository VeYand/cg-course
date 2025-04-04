import {vec3, mat4} from 'gl-matrix'
import {Cube} from './Cube'

class Maze {
	private maze: number[][] = []
	private cubes: Cube[] = []
	private readonly MAZE_SIZE = 16
	private readonly CELL_SIZE = 1.0

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly shaderProgram: WebGLProgram,
	) {
		this.generateMaze()
		this.initCubes()
	}

	render(viewMatrix: mat4, projectionMatrix: mat4) {
		for (const cube of this.cubes) {
			cube.render(viewMatrix, projectionMatrix)
		}
	}

	getSize() {
		return {
			cellSize: this.CELL_SIZE,
			mazeSize: this.MAZE_SIZE,
		}
	}

	isWalkable(x: number, z: number): boolean {
		// @ts-expect-error
		return this.maze[z][x] === 0
	}

	private generateMaze() {
		this.maze = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
			[1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
			[1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
			[1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
			[1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
			[1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
			[1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		]
	}

	private initCubes() {
		for (let i = 0; i < this.MAZE_SIZE; i++) {
			for (let j = 0; j < this.MAZE_SIZE; j++) {
				// @ts-expect-error
				if (this.maze[i][j] === 1) {
					const x = j * this.CELL_SIZE + this.CELL_SIZE / 2
					const z = i * this.CELL_SIZE + this.CELL_SIZE / 2
					const y = 0.5

					let color: vec3
					if (i === 0 || j === 0 || i === this.MAZE_SIZE - 1 || j === this.MAZE_SIZE - 1) {
						color = vec3.fromValues(1, 0, 0)
					}
					else {
						color = vec3.fromValues(0.3, i / this.MAZE_SIZE, j / this.MAZE_SIZE)
					}
					const cube = new Cube(this.gl, this.shaderProgram, color, [x, y, z], this.CELL_SIZE)
					this.cubes.push(cube)
				}
			}
		}
	}
}

export {
	Maze,
}
