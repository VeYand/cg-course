import {Color, Position} from './types'

class Drawer {
	private readonly ctx: CanvasRenderingContext2D

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx
	}

	drawLine(start: Position, end: Position, color: Color): void {
		const deltaX = Math.abs(end.x - start.x)
		const deltaY = Math.abs(end.y - start.y)

		if (deltaY > deltaX) {
			this.drawSteepLine(start, end, color)
		}
		else {
			this.drawShallowLine(start, end, color)
		}
	}

	drawCircle(center: Position, radius: number, color: Color): void {
		let x = 0
		let y = radius
		let d = 3 - 2 * radius

		while (x <= y) {
			this.setPixel(center.x + x, center.y + y, color)
			this.setPixel(center.x - x, center.y + y, color)
			this.setPixel(center.x + x, center.y - y, color)
			this.setPixel(center.x - x, center.y - y, color)
			this.setPixel(center.x + y, center.y + x, color)
			this.setPixel(center.x - y, center.y + x, color)
			this.setPixel(center.x + y, center.y - x, color)
			this.setPixel(center.x - y, center.y - x, color)

			if (d < 0) {
				d += 4 * x + 6
			}
			else {
				d += 4 * (x - y) + 10
				y--
			}
			x++
		}
	}

	fillCircle(center: Position, radius: number, color: Color): void {
		for (let y = -radius; y <= radius; y++) {
			for (let x = -radius; x <= radius; x++) {
				if (x * x + y * y <= radius * radius) {
					this.setPixel(center.x + x, center.y + y, color)
				}
			}
		}
	}

	private drawSteepLine(start: Position, end: Position, color: Color): void {
		if (start.y > end.y) {
			[start, end] = [end, start]
		}

		const deltaX = Math.abs(end.x - start.x)
		const deltaY = end.y - start.y
		const stepX = Math.sign(end.x - start.x)
		let error = deltaX - deltaY / 2
		let x = start.x

		for (let y = start.y; y <= end.y; y++) {
			this.setPixel(x, y, color)
			error += deltaX
			if (error >= deltaY) {
				x += stepX
				error -= deltaY
			}
		}
	}

	private drawShallowLine(start: Position, end: Position, color: Color): void {
		if (start.x > end.x) {
			[start, end] = [end, start]
		}

		const deltaX = end.x - start.x
		const deltaY = Math.abs(end.y - start.y)
		const stepY = Math.sign(end.y - start.y)
		let error = deltaY - deltaX / 2
		let y = start.y

		for (let x = start.x; x <= end.x; x++) {
			this.setPixel(x, y, color)
			error += deltaY
			if (error >= deltaX) {
				y += stepY
				error -= deltaX
			}
		}
	}

	private setPixel(x: number, y: number, color: Color): void {
		this.ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`
		this.ctx.fillRect(x, y, 1, 1)
	}
}

export {
	Drawer,
}