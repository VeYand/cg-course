import {mat4, vec3} from 'gl-matrix'
import {Cube} from './Cube'
import {GLContext} from './GLContext'

enum CUBE_TYPE {
	EMPTY = 0,
	BRICK,
	BAD,
	CONCRETE,
	STONE,
	WHITE,
	MOULD,
}

class Cubes {
	private maze: CUBE_TYPE[][] = []
	private cubes: Cube[] = []
	private readonly MAZE_SIZE = 16
	private readonly CELL_SIZE = 1.0

	constructor(
		private readonly ctx: GLContext,
		private readonly textures: Record<CUBE_TYPE, WebGLTexture>,
		private readonly pos: vec3,
	) {
		this.generateMaze()
		this.initCubes()
	}

	render(viewMatrix: mat4) {
		for (const cube of this.cubes) {
			cube.render(viewMatrix)
		}
	}

	getSize() {
		return {
			cellSize: this.CELL_SIZE,
			mazeSize: this.MAZE_SIZE,
		}
	}

	private generateMaze() {
		const empty = CUBE_TYPE.EMPTY
		const brick = CUBE_TYPE.BRICK
		const bad = CUBE_TYPE.BAD
		const concrete = CUBE_TYPE.CONCRETE
		const stone = CUBE_TYPE.STONE
		const white = CUBE_TYPE.WHITE
		const mould = CUBE_TYPE.MOULD

		this.maze = [
			[brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick],
			[brick, empty, empty, empty, empty, empty, empty, concrete, empty, empty, white, empty, white, empty, white, brick],
			[brick, empty, bad, bad, empty, concrete, empty, white, empty, empty, white, empty, white, empty, white, brick],
			[brick, empty, bad, empty, empty, concrete, empty, white, empty, empty, white, empty, white, empty, white, brick],
			[brick, empty, bad, concrete, stone, concrete, empty, white, empty, empty, empty, empty, empty, empty, empty, brick],
			[brick, empty, empty, empty, empty, empty, empty, stone, empty, concrete, empty, concrete, empty, concrete, empty, brick],
			[brick, empty, mould, mould, empty, mould, mould, stone, empty, concrete, empty, concrete, empty, concrete, empty, brick],
			[brick, empty, mould, empty, empty, mould, empty, stone, empty, concrete, empty, concrete, empty, concrete, empty, brick],
			[brick, empty, mould, mould, empty, mould, empty, stone, empty, empty, empty, empty, empty, empty, empty, brick],
			[brick, empty, empty, empty, empty, empty, empty, stone, empty, empty, stone, empty, concrete, empty, concrete, brick],
			[brick, mould, mould, mould, mould, mould, empty, stone, empty, empty, concrete, empty, concrete, empty, concrete, brick],
			[brick, empty, empty, empty, empty, empty, empty, stone, empty, empty, bad, empty, bad, empty, bad, brick],
			[brick, empty, white, white, empty, white, white, stone, empty, empty, empty, empty, empty, empty, empty, brick],
			[brick, empty, white, white, empty, white, empty, stone, empty, white, empty, bad, empty, bad, empty, brick],
			[brick, empty, empty, white, empty, empty, empty, empty, empty, white, empty, white, empty, white, empty, brick],
			[brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick, brick],
		]
	}

	private initCubes() {
		for (let i = 0; i < this.MAZE_SIZE; i++) {
			for (let j = 0; j < this.MAZE_SIZE; j++) {
				// @ts-expect-error
				const type = this.maze[i][j]
				if (type !== undefined && type !== CUBE_TYPE.EMPTY) {
					const x = this.pos[0] + j * this.CELL_SIZE + this.CELL_SIZE / 2
					const y = this.pos[1] + 0.5
					const z = this.pos[2] + i * this.CELL_SIZE + this.CELL_SIZE / 2
					const cube = new Cube(this.ctx, this.textures[type], [x, y, z], {
						width: this.CELL_SIZE,
						height: this.CELL_SIZE,
						depth: this.CELL_SIZE,
					})
					this.cubes.push(cube)
				}
			}
		}
	}
}

export {
	CUBE_TYPE,
	Cubes,
}
