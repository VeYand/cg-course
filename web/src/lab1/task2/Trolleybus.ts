import {Color, Position, Size} from './types'

class Trolleybus {
	private readonly WINDOW_COLOR = 'lightblue'
	private readonly WHEEL_COLOR = 'black'
	private readonly PANTOGRAPH_COLOR = 'gray'
	private readonly PANTOGRAPH_WIDTH = 2
	private readonly PANTOGRAPH_HEAD_COLOR = 'red'
	private readonly PANTOGRAPH_HEAD_WIDTH = 10
	private readonly PANTOGRAPH_HEAD_HEIGHT = 5
	private readonly WINDOW_WIDTH = 20
	private readonly WINDOW_HEIGHT = 20
	private readonly WHEEL_RADIUS = 10
	private readonly WHEEL_Y_OFFSET = 5
	private readonly WHEEL_X_OFFSET = 15
	private readonly WINDOW_X_OFFSET = 10
	private readonly PANTOGRAPH_X_OFFSET = 10
	private readonly FIRST_PANTOGRAPH_X_OFFSET = 35
	private readonly SECOND_PANTOGRAPH_X_OFFSET = 15
	private readonly PANTOGRAPH_HEAD_X_OFFSET = 5
	private readonly PANTOGRAPH_HEAD_Y_OFFSET = 2.5

	private isDragging = false
	private offsetX = 0
	private offsetY = 0

	// eslint-disable-next-line max-params
	constructor(
		private trolleybusPosition: Position,
		private firstWireY: number,
		private secondWireY: number,
		private trolleybusSize: Size,
		private color: Color,
		private readonly canvas: HTMLCanvasElement,
	) {
		this.setupEventListeners()
	} // todo использовать для рисования траснформации вместо смещения

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = `rgb(${this.color.r * 255}, ${this.color.g * 255}, ${this.color.b * 255})`
		ctx.fillRect(
			this.trolleybusPosition.x,
			this.trolleybusPosition.y,
			this.trolleybusSize.width,
			this.trolleybusSize.height,
		)

		this.drawWindow(
			ctx,
			this.trolleybusPosition.x + this.WINDOW_X_OFFSET,
			this.trolleybusPosition.y + this.WINDOW_X_OFFSET,
		)
		this.drawWindow(
			ctx,
			this.trolleybusPosition.x + this.WINDOW_X_OFFSET * 4,
			this.trolleybusPosition.y + this.WINDOW_X_OFFSET,
		)
		this.drawWindow(
			ctx,
			this.trolleybusPosition.x + this.WINDOW_X_OFFSET * 7,
			this.trolleybusPosition.y + this.WINDOW_X_OFFSET,
		)

		this.drawWheel(
			ctx,
			this.trolleybusPosition.x + this.WHEEL_Y_OFFSET + this.WHEEL_X_OFFSET,
			this.trolleybusPosition.y + this.trolleybusSize.height - this.WHEEL_Y_OFFSET,
		)
		this.drawWheel(
			ctx,
			this.trolleybusPosition.x + this.trolleybusSize.width - this.WHEEL_X_OFFSET,
			this.trolleybusPosition.y + this.trolleybusSize.height - this.WHEEL_Y_OFFSET,
		)

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


	private setupEventListeners() {
		this.canvas.addEventListener('mousedown', this.handleMouseDown)
		this.canvas.addEventListener('mousemove', this.handleMouseMove)
		this.canvas.addEventListener('mouseup', this.handleMouseUp)
	}

	private drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.fillStyle = this.WINDOW_COLOR
		ctx.fillRect(x, y, this.WINDOW_WIDTH, this.WINDOW_HEIGHT)
	}

	private drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.fillStyle = this.WHEEL_COLOR
		ctx.beginPath()
		ctx.arc(x, y, this.WHEEL_RADIUS, 0, 2 * Math.PI)
		ctx.fill()
	}

	private drawPantographes(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.PANTOGRAPH_COLOR
		ctx.lineWidth = this.PANTOGRAPH_WIDTH

		ctx.beginPath()
		ctx.moveTo(
			this.trolleybusPosition.x + this.trolleybusSize.width / 2 - this.PANTOGRAPH_X_OFFSET,
			this.trolleybusPosition.y,
		)
		const firstWireX
			= this.trolleybusPosition.x + this.trolleybusSize.width / 2 - this.FIRST_PANTOGRAPH_X_OFFSET
		ctx.lineTo(firstWireX, this.firstWireY)
		ctx.stroke()
		ctx.fillStyle = this.PANTOGRAPH_HEAD_COLOR
		ctx.fillRect(
			firstWireX - this.PANTOGRAPH_HEAD_X_OFFSET,
			this.firstWireY - this.PANTOGRAPH_HEAD_Y_OFFSET,
			this.PANTOGRAPH_HEAD_WIDTH,
			this.PANTOGRAPH_HEAD_HEIGHT,
		)

		ctx.beginPath()
		ctx.moveTo(
			this.trolleybusPosition.x + this.trolleybusSize.width / 2 + this.PANTOGRAPH_X_OFFSET,
			this.trolleybusPosition.y,
		)
		const secondWireX = this.trolleybusPosition.x + this.trolleybusSize.width / 2 - this.SECOND_PANTOGRAPH_X_OFFSET
		ctx.lineTo(secondWireX, this.secondWireY)
		ctx.stroke()
		ctx.fillStyle = this.PANTOGRAPH_HEAD_COLOR
		ctx.fillRect(
			secondWireX - this.PANTOGRAPH_HEAD_X_OFFSET,
			this.secondWireY - this.PANTOGRAPH_HEAD_Y_OFFSET,
			this.PANTOGRAPH_HEAD_WIDTH,
			this.PANTOGRAPH_HEAD_HEIGHT,
		)
	}

	private handleMouseDown = (event: MouseEvent) => { // todo сделать два троллебуйса
		const mouseX = event.clientX
		const mouseY = event.clientY

		if (
			mouseX >= this.getPosition().x
			&& mouseX <= this.getPosition().x + this.getSize().width
			&& mouseY >= this.getPosition().y
			&& mouseY <= this.getPosition().y + this.getSize().height
		) {
			this.isDragging = true
			this.offsetX = mouseX - this.getPosition().x
			this.offsetY = mouseY - this.getPosition().y
		}
	}

	private handleMouseMove = (event: MouseEvent) => {
		if (this.isDragging) {
			const mouseX = event.clientX
			const mouseY = event.clientY

			const newX = mouseX - this.offsetX
			const newY = mouseY - this.offsetY

			this.setPosition({x: newX, y: newY})
		}
	}

	private handleMouseUp = () => {
		this.isDragging = false
	}
}

export {Trolleybus}