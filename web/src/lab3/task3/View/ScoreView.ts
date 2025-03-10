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
	private readonly gameDocument: TetrisDocument

	// Позиция и размер области для отображения счета в мировых координатах
	private x = -9   // слева от центра
	private y = 12   // сверху (можно настроить)
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
		this.updateScoreTexture(this.gameDocument.getScore())
	}

	render() {
		const currentScore = this.gameDocument.getScore()
		if (currentScore !== this.lastScore) {
			this.updateScoreTexture(currentScore)
			this.lastScore = currentScore
		}
		if (this.scoreTexture) {
			this.renderer.drawTexturedQuad(this.x, this.y, this.width, this.height, this.scoreTexture)
		}
	}

	notify(event: GameEvent) {
		// При изменениях можно обновлять счет, здесь обновление происходит в render()
	}

	private updateScoreTexture(score: number) {
		const ctx = this.ctx
		// Очищаем холст
		ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
		// Заливаем фон
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
		// Рисуем текст счета
		ctx.fillStyle = 'white'
		ctx.font = '48px sans-serif'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(`Score: ${score}`, this.offscreenCanvas.width / 2, this.offscreenCanvas.height / 2)
		// Обновляем текстуру WebGL
		const gl = this.gl
		gl.bindTexture(gl.TEXTURE_2D, this.scoreTexture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.offscreenCanvas)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.bindTexture(gl.TEXTURE_2D, null)
	}
}

export {
	ScoreView,
}
