import {Trolleybus} from './Trolleybus'
import {Wires} from './Wires'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

if (!ctx) {
	throw new Error('Canvas 2D context not supported')
}

const centerX = canvas.width / 2
const centerY = canvas.height / 2

const wires = new Wires({x: 0, y: centerY - 100}, {width: canvas.width, height: 20}, {r: 0, g: 0, b: 0})

let isDragging = false
let offsetX = 0
let offsetY = 0

const trolleybus = new Trolleybus(
	{x: centerX, y: centerY},
	{x: wires.getSize().width / 2, y: wires.getPosition().y},
	{x: wires.getSize().width / 2, y: wires.getPosition().y + wires.getSize().height},
	{width: 100, height: 50},
	{r: 0, g: 1, b: 0},
)

canvas.addEventListener('mousedown', event => {
	const mouseX = event.clientX
	const mouseY = event.clientY

	if (
		mouseX >= trolleybus.getPosition().x
		&& mouseX <= trolleybus.getPosition().x + trolleybus.getSize().width
		&& mouseY >= trolleybus.getPosition().y
		&& mouseY <= trolleybus.getPosition().y + trolleybus.getSize().height
	) {
		isDragging = true
		offsetX = mouseX - trolleybus.getPosition().x
		offsetY = mouseY - trolleybus.getPosition().y
	}
})

canvas.addEventListener('mousemove', event => {
	if (isDragging) {
		const mouseX = event.clientX
		const mouseY = event.clientY

		const newX = mouseX - offsetX
		const newY = mouseY - offsetY

		trolleybus.setPosition({x: newX, y: newY})
		trolleybus.updatePantographPositions(wires.getPosition(), wires.getSize())
	}
})

canvas.addEventListener('mouseup', () => {
	isDragging = false
})

const resizeCanvas = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	render()
}

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	wires.draw(ctx)
	trolleybus.draw(ctx)

	requestAnimationFrame(render)
}

render()
window.addEventListener('resize', resizeCanvas)

export {}