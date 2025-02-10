import {GameDocument} from '../Document/GameDocument'

class Game {
	constructor(
		private readonly gameDocument: GameDocument,
	) {
	}

	reader(): void {
		this.gameDocument.newGame()
	}
}
export {
	Game,
}