import config from './gameConfig.json'

type Word = {
	hint: string,
	answer: string,
}

type GameConfig = {
	words: Word[],
}

class GameDocument {
	private readonly config: GameConfig
	private currentWord: Word = {hint: '', answer: ''}
	private currentAttempts = 0

	constructor() {
		this.config = config as GameConfig
		this.newGame()
	}

	newGame() {
		const wordIndex = Math.floor(Math.random() * this.config.words.length)
		const newWord = this.config.words[wordIndex]
		if (newWord) {
			this.currentWord = newWord
		}
		this.currentAttempts = 0
	}

	getAllowedLetters(): string[] {
		return [
			'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П',
			'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
		]
	}

	guess(char: string): void {
		if (!this.getAllowedLetters().includes(char)) {
			throw new Error('Char is not allowed')
		}


		// const includes = this.currentWord.answer.toLowerCase().includes(char.toLowerCase())
		//
		// const indexes: number[] = []
		// for (let i = 0; i < this.currentWord.answer.length; i++) {
		// 	if (this.currentWord.answer[i]?.toLowerCase() === char.toLowerCase()) {
		// 		indexes.push(i)
		// 	}
		// }
	}
}

export {
	GameDocument,
}