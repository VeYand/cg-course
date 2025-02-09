import {Trolleybus} from './Trolleybus'
import {Wires} from './Wires'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly ctx: CanvasRenderingContext2D
	private wires: Wires
	private trolleybus: Trolleybus
	private isDragging = false
	private offsetX = 0
	private offsetY = 0

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
			{x: 0, y: centerY - 100},
			{width: this.canvas.width, height: 5},
			{r: 0, g: 0, b: 0},
		)

		this.trolleybus = new Trolleybus(
			{x: centerX, y: centerY},
			this.wires.getPosition().y,
			this.wires.getPosition().y + this.wires.getSize().height,
			{width: 100, height: 50},
			{r: 0, g: 1, b: 0},
		)

		this.setupEventListeners()
	}

	run = () => {
		this.render()
	}

	private setupEventListeners() {
		this.canvas.addEventListener('mousedown', this.handleMouseDown)
		this.canvas.addEventListener('mousemove', this.handleMouseMove)
		this.canvas.addEventListener('mouseup', this.handleMouseUp)
		window.addEventListener('resize', this.resizeCanvas)
	}

	private handleMouseDown = (event: MouseEvent) => {
		const mouseX = event.clientX
		const mouseY = event.clientY

		if (
			mouseX >= this.trolleybus.getPosition().x
			&& mouseX <= this.trolleybus.getPosition().x + this.trolleybus.getSize().width
			&& mouseY >= this.trolleybus.getPosition().y
			&& mouseY <= this.trolleybus.getPosition().y + this.trolleybus.getSize().height
		) {
			this.isDragging = true
			this.offsetX = mouseX - this.trolleybus.getPosition().x
			this.offsetY = mouseY - this.trolleybus.getPosition().y
		}
	}

	private handleMouseMove = (event: MouseEvent) => {
		if (this.isDragging) {
			const mouseX = event.clientX
			const mouseY = event.clientY

			const newX = mouseX - this.offsetX
			const newY = mouseY - this.offsetY

			this.trolleybus.setPosition({x: newX, y: newY})
		}
	}

	private handleMouseUp = () => {
		this.isDragging = false
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.render()
	}

	private render = () => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		this.wires.draw(this.ctx)
		this.trolleybus.draw(this.ctx)

		requestAnimationFrame(this.render)
	}
}

const app = new App()
app.run()