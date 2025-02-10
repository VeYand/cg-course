import config from './gameConfig.json'

type Word = {
	hint: string,
	answer: string,
}

type GameConfig = {
	words: Word[],
}

type GameState = 'playing' | 'over'

type DocumentState = {
	mistakes: number,
	state: GameState,
	wordLength: number,
	answer: {char: string, wordIndex: number}[],
	hint: string,
}

type DocumentListener = (state: DocumentState) => void

class GameDocument {
	private readonly config: GameConfig
	private currentWord: Word = {hint: '', answer: ''}
	private currentMistakes = 0
	private readonly MAX_MISTAKES = 7
	private currentAnswer: {char: string, wordIndex: number}[] = []
	private state: GameState = 'playing'
	private listeners: DocumentListener[] = []

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
		this.currentMistakes = 0
		this.currentAnswer = []
		this.state = 'playing'
		this.notifyListeners()
	}

	getAllowedLetters(): string[] {
		return [
			'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П',
			'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
		]
	}

	registerListener(listener: DocumentListener): void {
		this.listeners.push(listener)
	}

	guess(char: string): void {
		if (!this.getAllowedLetters().includes(char)) {
			throw new Error('Char is not allowed')
		}

		if (this.currentMistakes >= this.MAX_MISTAKES) {
			throw new Error('Game over')
		}

		if (this.currentAnswer.map(a => a.char.toLowerCase()).includes(char.toLowerCase())) {
			throw new Error('Already used')
		}

		const includes = this.currentWord.answer.toLowerCase().includes(char.toLowerCase())
		if (!includes) {
			this.currentMistakes++
			this.state = this.currentMistakes >= this.MAX_MISTAKES ? 'over' : 'playing'
			this.notifyListeners()
			return
		}

		const indexes: number[] = []
		for (let i = 0; i < this.currentWord.answer.length; i++) {
			if (this.currentWord.answer[i]?.toLowerCase() === char.toLowerCase()) {
				indexes.push(i)
			}
		}
		this.currentAnswer = [...this.currentAnswer, ...indexes.map(i => ({char: char, wordIndex: i}))]
		this.notifyListeners()
	}

	private notifyListeners(): void {
		for (const listener of this.listeners) {
			listener({
				mistakes: this.currentMistakes,
				state: this.state,
				answer: this.currentAnswer,
				hint: this.currentWord.hint,
				wordLength: this.currentWord.answer.length,
			})
		}
	}
}

export {
	GameDocument,
}

export type {
	DocumentState,
}