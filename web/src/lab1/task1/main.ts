import {Letter} from './Letter/Letter'
import {DrawStrategyB, DrawStrategyL, DrawStrategyTC} from './Letter/Strategy/DrawStrategy'

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
}

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const centerX = canvas.width / 2
	const centerY = canvas.height / 2

	const letters = [
		new Letter({x: centerX - 100, y: centerY}, {r: 1, g: 0, b: 0}, new DrawStrategyTC()),
		new Letter({x: centerX, y: centerY}, {r: 0, g: 1, b: 0}, new DrawStrategyB()),
		new Letter({x: centerX + 100, y: centerY}, {r: 0, g: 0, b: 1}, new DrawStrategyL()),
	]

	for (const letter of letters) {
		letter.draw(ctx)
	}
}

resizeCanvas()
render()

window.addEventListener('resize', () => {
	resizeCanvas()
	render()
})

export { }
