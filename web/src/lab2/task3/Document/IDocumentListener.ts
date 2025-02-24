import {GameEvent} from './DocumentEvent'

type IDocumentListener = {
	notify: (event: GameEvent) => void,
}

export type {
	IDocumentListener,
}