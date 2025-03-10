import {TileData} from './TetrisDocument'

type GameEvent =
	| {type: 'updatedField', data: {newTiles: TileData[]}}
	| {type: 'nextTetramino', data: {newTiles: TileData[]}}
	| {type: 'lineClear', data: {lines: number[]}}
	| {type: 'levelUp', data: {level: number}}
	| {type: 'gameOver'}

export type {GameEvent}
