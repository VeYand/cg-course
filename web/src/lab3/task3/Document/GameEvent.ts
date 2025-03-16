import {TileData} from './TetrisDocument'

type GameEvent =
	| {type: 'tetraminoFieldUpdated'}
	| {type: 'clearedLines'}
	| {type: 'nextTetramino', data: {newTiles: TileData[]}}
	| {type: 'scoreUpdated', data: {score: number, level: number, clearedLines: number}}
	| {type: 'gameOver'}


export type {
	GameEvent,
}
