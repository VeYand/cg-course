import {GameDocument} from '../Document/GameDocument'
import {Gallows} from './Gallows'
import {GuessedLetters} from './GuessedLetters'
import {LettersInput} from './LettersInput'
import {Renderer} from './Renderer'

class Game implements Renderer {
	private readonly gallows: Gallows
	private readonly letters: GuessedLetters
	private readonly lettersInputField: LettersInput

	constructor(
		private readonly gameDocument: GameDocument,
		ctx: CanvasRenderingContext2D,
	) {
		this.gallows = new Gallows(ctx, gameDocument)
		this.letters = new GuessedLetters()
		this.lettersInputField = new LettersInput(gameDocument)

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