import {DrawerDocument} from '../Document/DrawerDocument'
import {IDocumentListener} from '../Document/IDocumentListener'

class DrawerCanvasView implements IDocumentListener {
	private readonly canvas: HTMLCanvasElement
	private readonly ctx: CanvasRenderingContext2D
	private isDrawing = false

	constructor(imageDocument: DrawerDocument) {
		this.canvas = imageDocument.getCanvas()
		const ctx = this.canvas.getContext('2d')
		if (!ctx) {
			throw new Error('Cannot initialize context')
		}
		this.ctx = ctx
		imageDocument.addListener(this)

		this.canvas.addEventListener('mousedown', e => this.startDrawing(e))
		this.canvas.addEventListener('mousemove', e => this.draw(e))
		this.canvas.addEventListener('mouseup', () => this.stopDrawing())
		this.canvas.addEventListener('mouseleave', () => this.stopDrawing())
	}

	notify(changedCanvas?: HTMLCanvasElement) {
		console.log(changedCanvas)
	}

	private startDrawing(event: MouseEvent) {
		if (event.button !== 0) {
			return
		}
		this.isDrawing = true
		this.ctx.beginPath()

		this.ctx.moveTo(event.clientX, event.clientY - 30)
	}

	private draw(event: MouseEvent) {
		if (!this.isDrawing) {
			return
		}
		this.ctx.lineTo(event.clientX, event.clientY - 30)
		this.ctx.strokeStyle = 'black'
		this.ctx.lineWidth = 5
		this.ctx.lineCap = 'round'
		this.ctx.stroke()
	}

	private stopDrawing() {
		if (this.isDrawing) {
			this.isDrawing = false
			this.ctx.closePath()
		}
	}
}

export {DrawerCanvasView}
