import './index.css'
import {Parabola} from './Parabola'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly glContext: WebGLRenderingContext
	private readonly parabola: Parabola

	constructor() {
		this.canvas = document.createElement('canvas')
		document.body.appendChild(this.canvas)
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		const glContext = this.canvas.getContext('webgl')
		if (!glContext) {
			throw new Error('Webgl context not supported')
		}
		this.glContext = glContext
		this.parabola = new Parabola(glContext)
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
		this.glContext.viewport(0, 0, window.innerWidth, window.innerHeight)
		this.render()
	}

	private render = () => {
		requestAnimationFrame(this.render)
		this.parabola.render()
	}

}

const app = new App()
app.run()

export {}
