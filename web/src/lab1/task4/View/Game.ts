import {GameDocument} from '../Document/GameDocument'
import {Gallows} from './Gallows'
import {Letters} from './Letters'
import {LettersInputField} from './LettersInputField'
import {Renderer} from './Renderer'

class Game implements Renderer {
	private readonly gallows: Gallows
	private readonly letters: Letters
	private readonly lettersInputField: LettersInputField

	constructor(
		private readonly gameDocument: GameDocument,
	) {
		this.gallows = new Gallows()
		this.letters = new Letters()
		this.lettersInputField = new LettersInputField()

		this.gameDocument.registerListener(state => this.gallows.notify(state))
		this.gameDocument.registerListener(state => this.letters.notify(state))
		this.gameDocument.registerListener(state => this.lettersInputField.notify(state))

		this.gameDocument.newGame()
	}

	render(): void {
		this.gallows.render()
		this.letters.render()
		this.lettersInputField.render()
	}
}
export {
	Game,
}