import {DocumentState} from '../Document/GameDocument'
import {Notifiable} from './Notifiable'
import {Renderer} from './Renderer'

class Letters implements Renderer, Notifiable {
	render(): void {
	}

	notify(gameState: DocumentState): void {
	}
}

export {
	Letters,
}