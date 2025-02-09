import {Color} from './Color'
import {IDrawable} from './IDrawable'
import {Position} from './Position'
import {IDrawStrategy} from './Strategy/DrawStrategy'

class Letter implements IDrawable {
	constructor(
		private m_position: Position,
		private m_color: Color,
		private m_drawStrategy: IDrawStrategy,
	) {
	}

	draw(gl: WebGLRenderingContext, program: WebGLProgram): void {
		this.m_drawStrategy.draw(gl, program, this.m_position, this.m_color)
	}
}

export {
	Letter,
}