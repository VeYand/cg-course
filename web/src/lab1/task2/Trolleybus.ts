import {Color, Position, Size} from './types'

class Trolleybus {
	constructor(
		private trolleybusPosition: Position,
		private firstWireY: number,
		private secondWireY: number,
		private trolleybusSize: Size,
		private color: Color,
	) {
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = `rgb(${this.color.r * 255}, ${this.color.g * 255}, ${this.color.b * 255})`
		ctx.fillRect(this.trolleybusPosition.x, this.trolleybusPosition.y, this.trolleybusSize.width, this.trolleybusSize.height)

		this.drawWindow(ctx, this.trolleybusPosition.x + 10, this.trolleybusPosition.y + 10)
		this.drawWindow(ctx, this.trolleybusPosition.x + 40, this.trolleybusPosition.y + 10)
		this.drawWindow(ctx, this.trolleybusPosition.x + 70, this.trolleybusPosition.y + 10)

		this.drawWheel(ctx, this.trolleybusPosition.x + 15, this.trolleybusPosition.y + this.trolleybusSize.height - 5)
		this.drawWheel(ctx, this.trolleybusPosition.x + this.trolleybusSize.width - 15, this.trolleybusPosition.y + this.trolleybusSize.height - 5)

		this.drawPantographes(ctx)
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

	private drawPantographes(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = 'gray'
		ctx.lineWidth = 2

		ctx.beginPath()
		ctx.moveTo(this.trolleybusPosition.x + 20, this.trolleybusPosition.y)
		const firstWireX = this.trolleybusPosition.x - 30
		ctx.lineTo(firstWireX, this.firstWireY)
		ctx.stroke()
		ctx.fillStyle = 'red'
		ctx.fillRect(firstWireX - 5, this.firstWireY - 2.5, 10, 5)

		ctx.beginPath()
		ctx.moveTo(this.trolleybusPosition.x + this.trolleybusSize.width - 20, this.trolleybusPosition.y)
		const secondWireX = this.trolleybusPosition.x + this.trolleybusSize.width - 70
		ctx.lineTo(secondWireX, this.secondWireY)
		ctx.stroke()
		ctx.fillStyle = 'red'
		ctx.fillRect(secondWireX - 5, this.secondWireY - 2.5, 10, 5)
	}
}

export {Trolleybus}