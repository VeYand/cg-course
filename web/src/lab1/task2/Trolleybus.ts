import {Color, Position, Size} from './types'

class Trolleybus {
	constructor(
		private trolleybusPosition: Position,
		private firstConnectorPosition: Position,
		private secondConnectorPosition: Position,
		private trolleybusSize: Size,
		private color: Color,
	) {
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = `rgb(${this.color.r * 255}, ${this.color.g * 255}, ${this.color.b * 255})`
		ctx.fillRect(this.trolleybusPosition.x, this.trolleybusPosition.y, this.trolleybusSize.width, this.trolleybusSize.height)

		// Окна
		this.drawWindow(ctx, this.trolleybusPosition.x + 10, this.trolleybusPosition.y + 10)
		this.drawWindow(ctx, this.trolleybusPosition.x + 40, this.trolleybusPosition.y + 10)
		this.drawWindow(ctx, this.trolleybusPosition.x + 70, this.trolleybusPosition.y + 10)

		// Колеса
		this.drawWheel(ctx, this.trolleybusPosition.x + 15, this.trolleybusPosition.y + this.trolleybusSize.height - 5)
		this.drawWheel(ctx, this.trolleybusPosition.x + this.trolleybusSize.width - 15, this.trolleybusPosition.y + this.trolleybusSize.height - 5)

		// Токоприемники
		this.drawPantograph(ctx, {x: this.trolleybusPosition.x + this.trolleybusSize.width - 20, y: this.trolleybusPosition.y}, this.firstConnectorPosition)
		this.drawPantograph(ctx, {x: this.trolleybusPosition.x + 20, y: this.trolleybusPosition.y}, this.secondConnectorPosition)
	}

	setPosition(newPosition: Position) {
		this.trolleybusPosition = newPosition
	}

	getPosition(): Position {
		return this.trolleybusPosition
	}

	getSize(): Size {
		return this.trolleybusSize
	}

	updatePantographPositions(wirePosition: Position, wireSize: Size) {
		this.firstConnectorPosition = {x: wireSize.width / 2, y: wirePosition.y}
		this.secondConnectorPosition = {x: wireSize.width / 2, y: wirePosition.y + wireSize.height}
	}

	private drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.fillStyle = 'lightblue'
		ctx.fillRect(x, y, 20, 20)
	}

	private drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.fillStyle = 'black'
		ctx.beginPath()
		ctx.arc(x, y, 10, 0, 2 * Math.PI)
		ctx.fill()
	}

	private drawPantograph(ctx: CanvasRenderingContext2D, from: Position, to: Position) {
		ctx.strokeStyle = 'gray'
		ctx.lineWidth = 2
		ctx.beginPath()
		ctx.moveTo(from.x, from.y)
		ctx.lineTo(to.x, to.y)
		ctx.stroke()

		ctx.fillStyle = 'red'
		ctx.fillRect(to.x - 5, to.y - 2.5, 10, 5)
	}
}

export {Trolleybus}