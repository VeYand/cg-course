import {TileData} from './TetrisDocument'

type GameEvent =
	| {type: 'updatedField', data: UpdatedFieldPayload}
	| {type: 'nextTetramino', data: NextTetraminoPayload}
	| {type: 'lineClear', data: LineClearPayload}
	| {type: 'gameOver'}

type UpdatedFieldPayload = {
	newTiles: TileData[],
}

type NextTetraminoPayload = {
	newTiles: TileData[],
}

type LineClearPayload = {
	lines: number[],
}

export type {
	GameEvent,
}