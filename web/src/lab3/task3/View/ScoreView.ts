import {GameEvent} from '../Document/GameEvent'
import {IDocumentListener} from '../Document/IDocumentListener'
import {TetrisDocument} from '../Document/TetrisDocument'
import {Renderable} from '../types'
import {Renderer} from './Renderer'

class ScoreView implements Renderable, IDocumentListener {
	private scoreTexture: WebGLTexture | null = null
	private offscreenCanvas: HTMLCanvasElement
	private ctx: CanvasRenderingContext2D
	private lastScore = -1
	private lastLevel = -1
	private lastLines = -1
	private readonly gameDocument: TetrisDocument

	// Позиция и размер области для отображения информационной панели
	private x = -9
	private y = 12
	private width = 8
	private height = 4

	constructor(
		private readonly gl: WebGLRenderingContext,
		private readonly program: WebGLProgram,
		gameDocument: TetrisDocument,
		private readonly renderer: Renderer,
	) {
		this.gameDocument = gameDocument
		gameDocument.addListener(this)
		this.offscreenCanvas = document.createElement('canvas')
		this.offscreenCanvas.width = 256
		this.offscreenCanvas.height = 128
		const ctx = this.offscreenCanvas.getContext('2d')
		if (!ctx) {
			throw new Error('Не удалось получить 2D контекст')
		}
		this.ctx = ctx
		this.scoreTexture = gl.createTexture()
		this.updateScoreTexture()
	}

	render() {
		const currentScore = this.gameDocument.getScore()
		const currentLevel = this.gameDocument.getLevel()
		const currentLines = this.gameDocument.getLinesCleared()
		if (currentScore !== this.lastScore || currentLevel !== this.lastLevel || currentLines !== this.lastLines) {
			this.updateScoreTexture()
			this.lastScore = currentScore
			this.lastLevel = currentLevel
			this.lastLines = currentLines
		}
		if (this.scoreTexture) {
			this.renderer.drawTexturedQuad(this.x, this.y, this.width, this.height, this.scoreTexture)
		}
	}

	notify(event: GameEvent) {
		// Обработка событий по необходимости
	}

	private updateScoreTexture() {
		const ctx = this.ctx
		ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
		ctx.fillStyle = 'white'
		ctx.font = '20px sans-serif'
		ctx.textAlign = 'left'
		ctx.textBaseline = 'top'
		const scoreText = `Score: ${this.gameDocument.getScore()}`
		const levelText = `Level: ${this.gameDocument.getLevel()}`
		const linesText = `Lines: ${this.gameDocument.getLinesCleared()}/${this.gameDocument.getLinesToLevelUp()}`
		const nextText = `Next: ${this.gameDocument.getNextTetraminoType()}`
		ctx.fillText(scoreText, 10, 10)
		ctx.fillText(levelText, 10, 40)
		ctx.fillText(linesText, 10, 70)
		ctx.fillText(nextText, 10, 100)
		const gl = this.gl
		gl.bindTexture(gl.TEXTURE_2D, this.scoreTexture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.offscreenCanvas)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.bindTexture(gl.TEXTURE_2D, null)
	}
}

export {ScoreView}
