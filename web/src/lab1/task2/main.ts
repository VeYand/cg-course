import {Trolleybus} from './Trolleybus'
import {Size} from './types'
import {Wires} from './Wires'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly ctx: CanvasRenderingContext2D
	private wires: Wires
	private firstTrolleybus: Trolleybus
	private secondTrolleybus: Trolleybus


	private readonly WIRE_HEIGHT = 5
	private readonly TROLLEYBUS_SIZE: Size = {width: 100, height: 50}
	private readonly TROLLEYBUS_COLOR = {r: 0, g: 1, b: 0}
	private readonly WIRE_COLOR = {r: 0, g: 0, b: 0}
	private readonly WIRE_Y_OFFSET = 100

	constructor() {
		this.canvas = document.createElement('canvas')
		document.body.appendChild(this.canvas)
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		const ctx = this.canvas.getContext('2d')

		if (!ctx) {
			throw new Error('Canvas 2D context not supported')
		}

		this.ctx = ctx

		const centerX = this.canvas.width / 2
		const centerY = this.canvas.height / 2

		this.wires = new Wires(
			{x: 0, y: centerY - this.WIRE_Y_OFFSET},
			{width: this.canvas.width, height: this.WIRE_HEIGHT},
			this.WIRE_COLOR,
		)

		this.firstTrolleybus = new Trolleybus(
			{x: centerX, y: centerY},
			this.wires.getPosition().y,
			this.wires.getPosition().y + this.wires.getSize().height,
			this.TROLLEYBUS_SIZE,
			this.TROLLEYBUS_COLOR,
			this.canvas,
		)

		this.secondTrolleybus = new Trolleybus(
			{x: centerX + 100, y: centerY + 100},
			this.wires.getPosition().y,
			this.wires.getPosition().y + this.wires.getSize().height,
			this.TROLLEYBUS_SIZE,
			{r: 0, g: 0, b: 1},
			this.canvas,
		)

		this.setupEventListeners()
	}

	run = () => {
		this.render()
	}

	private setupEventListeners() {
		window.addEventListener('resize', this.resizeCanvas)
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.render()
	}

	private render = () => { // TODO показать 2 троллейбуса
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		this.wires.draw(this.ctx)
		this.firstTrolleybus.draw(this.ctx)
		this.secondTrolleybus.draw(this.ctx)

		requestAnimationFrame(this.render)
	}
}

const app = new App()
app.run()