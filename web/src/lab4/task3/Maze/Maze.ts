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

	render(viewMatrix: mat4, projectionMatrix: mat4, lightDir: vec3) {
		for (const cube of this.cubes) {
			cube.render(viewMatrix, projectionMatrix, lightDir)
		}
	}

	getSize() {
		return {
			cellSize: this.CELL_SIZE,
			mazeSize: this.MAZE_SIZE,
		}
	}

	private generateMaze() {
		for (let i = 0; i < this.MAZE_SIZE; i++) {
			this.maze[i] = []
			for (let j = 0; j < this.MAZE_SIZE; j++) {
				if (i === 0 || j === 0 || i === this.MAZE_SIZE - 1 || j === this.MAZE_SIZE - 1) {
					// @ts-expect-error
					this.maze[i][j] = 1
				}
				else {
					// @ts-expect-error
					this.maze[i][j] = (i % 2 === 0 && j % 3 === 0) ? 1 : 0
				}
			}
		}
	}

	private initCubes() {
		for (let i = 0; i < this.MAZE_SIZE; i++) {
			for (let j = 0; j < this.MAZE_SIZE; j++) {
				// @ts-expect-error
				if (this.maze[i][j] === 1) {
					const x = j * this.CELL_SIZE + this.CELL_SIZE / 2
					const z = i * this.CELL_SIZE + this.CELL_SIZE / 2
					const y = 0.5

					const color = vec3.fromValues(1.0, 0.0, 0.0)
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