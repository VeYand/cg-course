import {IDocumentListener} from './IDocumentListener'

class DrawerDocument {
	private readonly canvas: HTMLCanvasElement
	private listeners: IDocumentListener[] = []

	constructor() {
		this.canvas = document.createElement('canvas')
		this.canvas.style.cssText = `
            position: fixed;
            top: 30px;
            left: 0;
            right: 0;
            bottom: 0;
        `
		this.resizeCanvas()
		document.body.append(this.canvas)
		window.addEventListener('resize', () => this.resizeCanvas())
	}


	getCanvas(): HTMLCanvasElement {
		return this.canvas
	}

	addListener(listener: IDocumentListener) {
		this.listeners.push(listener)
	}

	loadImage(imageBitmap: ImageBitmap) {
		const ctx = this.canvas.getContext('2d')
		if (ctx) {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

			const width = window.innerWidth
			const height = window.innerHeight - 30

			const scale = Math.min(
				width / imageBitmap.width,
				height / imageBitmap.height,
			)
			const w = imageBitmap.width * scale
			const h = imageBitmap.height * scale

			ctx.canvas.width = w
			ctx.canvas.height = h
			ctx.drawImage(imageBitmap, 0, 0, w, h)
		}
		this.notifyListeners()
	}

	clearCanvas() {
		const ctx = this.canvas.getContext('2d')
		if (ctx) {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		}
		this.notifyListeners()
	}

	private resizeCanvas() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight - 30
	}

	private notifyListeners() {
		this.listeners.forEach(listener => listener.notify(this.canvas))
	}
}

export {DrawerDocument}
