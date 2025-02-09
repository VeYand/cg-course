import {Trolleybus} from './Trolleybus'
import {Position} from './types'
import {Wires} from './Wires'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')

if (!ctx) {
	throw new Error('Canvas 2D context not supported')
}

const resizeCanvas = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	render()
}

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const centerX = canvas.width / 2
	const centerY = canvas.height / 2

	const wires = new Wires({x: 0, y: centerY - 100}, {width: canvas.width, height: 20}, {r: 0, g: 0, b: 0})

	const firstConnectorPos: Position = {x: wires.getSize().width / 2, y: wires.getPosition().y}
	const secondConnectorPos: Position = {x: wires.getSize().width / 2, y: wires.getPosition().y + wires.getSize().height}

	const house = new Trolleybus(
		{x:   centerX, y: centerY},
		firstConnectorPos,
		secondConnectorPos,
		{width: 100, height: 50}, {r: 0, g: 1, b: 0})

	wires.draw(ctx)
	house.draw(ctx)

	requestAnimationFrame(render)
}

render()
window.addEventListener('resize', resizeCanvas)

export {}