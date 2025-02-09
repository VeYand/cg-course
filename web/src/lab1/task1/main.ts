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

const amplitude = 50
const period = 2000

type LetterData = {
	letter: Letter,
	phase: number,
}

const letters: LetterData[] = [
	{
		letter: new Letter({x: 0, y: 0}, {r: 1, g: 0, b: 0}, new DrawStrategyTC()),
		phase: 0,
	},
	{
		letter: new Letter({x: 0, y: 0}, {r: 0, g: 1, b: 0}, new DrawStrategyB()),
		phase: Math.PI / 3,
	},
	{
		letter: new Letter({x: 0, y: 0}, {r: 0, g: 0, b: 1}, new DrawStrategyL()),
		phase: (2 * Math.PI) / 3,
	},
]

const resizeCanvas = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	render()
}

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const centerX = canvas.width / 2
	const centerY = canvas.height / 2

	const time = Date.now()

	letters.forEach((letterData, index) => {
		const {letter, phase} = letterData
		const offsetY = amplitude * Math.sin(2 * Math.PI * time / period + phase)
		letter.setPosition({
			x: centerX + (index - 1) * 100,
			y: centerY + offsetY,
		})

		letter.draw(ctx)
	})

	requestAnimationFrame(render)
}

render()
window.addEventListener('resize', resizeCanvas)

export {}