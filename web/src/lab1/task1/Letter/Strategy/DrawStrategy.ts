import {Color} from '../Color'
import {Position} from '../Position'

type IDrawStrategy = {
	draw: (ctx: CanvasRenderingContext2D, position: Position, color: Color) => void,
}

class DrawStrategyTC implements IDrawStrategy {
	draw(ctx: CanvasRenderingContext2D, position: Position, color: Color): void {
		ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`

		ctx.fillRect(position.x - 20, position.y - 50, 10, 100)
		ctx.fillRect(position.x + 10, position.y - 50, 10, 100)
		ctx.fillRect(position.x - 20, position.y - 50, 40, 10)
	}
}

class DrawStrategyB implements IDrawStrategy {
	draw(ctx: CanvasRenderingContext2D, position: Position, color: Color): void {
		ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`

		ctx.fillRect(position.x - 20, position.y - 50, 10, 100)
		ctx.fillRect(position.x - 10, position.y + 30, 30, 10)
		ctx.fillRect(position.x - 10, position.y + 5, 20, 5)
		ctx.fillRect(position.x + 10, position.y + 5, 10, 45)
		ctx.fillRect(position.x + 10, position.y - 50, 10, 55)
	}
}

class DrawStrategyL implements IDrawStrategy {
	draw(ctx: CanvasRenderingContext2D, position: Position, color: Color): void {
		ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`

		ctx.fillRect(position.x - 20, position.y - 50, 10, 100)
		ctx.fillRect(position.x - 10, position.y + 40, 30, 10)
	}
}

export type {
	IDrawStrategy,
}

export {
	DrawStrategyTC,
	DrawStrategyB,
	DrawStrategyL,
}
