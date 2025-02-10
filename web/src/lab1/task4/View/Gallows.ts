import {DocumentState} from '../Document/GameDocument'
import {Notifiable} from './Notifiable'
import {Renderer} from './Renderer'

class Gallows implements Renderer, Notifiable {
	render(): void {
	}

	notify(gameState: DocumentState): void {
	}
}

export {
	Gallows,
}