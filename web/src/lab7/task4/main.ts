import {createShaderProgram} from '../../common/WebGLUtils'
import './index.css'
import {Mandelbrot} from './Mandelbrot/Mandelbrot'
import {vertexShaderSource, fragmentShaderSource} from './shaders'

class App {
	private readonly canvas: HTMLCanvasElement
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private readonly mandelbrot: Mandelbrot

	private lastMouse: {x: number, y: number} | null = null
	private zoomFactor = 0.1

	constructor() {
		this.canvas = document.createElement('canvas')
		document.body.appendChild(this.canvas)
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight

		const gl = this.canvas.getContext('webgl')
		if (!gl) {
			throw new Error('WebGL не поддерживается')
		}

		this.gl = gl
		this.program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource)
		this.mandelbrot = new Mandelbrot(gl, this.program)

		this.initEvents()
		this.loadPaletteImage()
	}

	private loadPaletteImage() {
		const img = new Image()
		img.src = '/fractal.png'
		img.onload = () => {
			this.mandelbrot.setPaletteImage(img)
			this.render()
		}
	}

	private initEvents() {
		window.addEventListener('resize', this.resizeCanvas)
		this.canvas.addEventListener('wheel', this.onWheel)
		this.canvas.addEventListener('mousedown', e => {
			this.lastMouse = {x: e.clientX, y: e.clientY}
		})
		this.canvas.addEventListener('mouseup', () => {
			this.lastMouse = null
		})
		this.canvas.addEventListener('mousemove', this.onMouseMove)
		window.addEventListener('keydown', this.onKeyDown)
		this.resizeCanvas()
	}

	private onMouseMove = (e: MouseEvent) => {
		if (!this.lastMouse) {
			return
		}
		const dx = e.clientX - this.lastMouse.x
		const dy = this.lastMouse.y - e.clientY
		const {width, height} = this.canvas

		const areaWidth = this.mandelbrot.areaW[1] - this.mandelbrot.areaW[0]
		const areaHeight = this.mandelbrot.areaH[1] - this.mandelbrot.areaH[0]

		const dxScaled = dx * areaWidth / width
		const dyScaled = dy * areaHeight / height

		this.mandelbrot.areaW = [
			this.mandelbrot.areaW[0] - dxScaled,
			this.mandelbrot.areaW[1] - dxScaled,
		]
		this.mandelbrot.areaH = [
			this.mandelbrot.areaH[0] - dyScaled,
			this.mandelbrot.areaH[1] - dyScaled,
		]

		this.lastMouse = {x: e.clientX, y: e.clientY}
	}

	private onWheel = (e: WheelEvent) => {
		const delta = e.deltaY > 0 ? 1 : -1
		const factor = 1 + delta * this.zoomFactor
		const [x0, x1] = this.mandelbrot.areaW
		const [y0, y1] = this.mandelbrot.areaH

		const centerX = (x0 + x1) / 2
		const centerY = (y0 + y1) / 2

		this.mandelbrot.areaW = [
			centerX - (centerX - x0) * factor,
			centerX + (x1 - centerX) * factor,
		]
		this.mandelbrot.areaH = [
			centerY - (centerY - y0) * factor,
			centerY + (y1 - centerY) * factor,
		]
	}

	private onKeyDown = (e: KeyboardEvent) => {
		const step = 10
		const {width, height} = this.canvas
		const areaWidth = this.mandelbrot.areaW[1] - this.mandelbrot.areaW[0]
		const areaHeight = this.mandelbrot.areaH[1] - this.mandelbrot.areaH[0]

		let dx = 0
		let dy = 0

		switch (e.key) {
			case 'ArrowUp':
				dy = -step
				break
			case 'ArrowDown':
				dy = step
				break
			case 'ArrowLeft':
				dx = step
				break
			case 'ArrowRight':
				dx = -step
				break
			default:
				return
		}

		const dxScaled = dx * areaWidth / width
		const dyScaled = dy * areaHeight / height

		this.mandelbrot.areaW = [
			this.mandelbrot.areaW[0] - dxScaled,
			this.mandelbrot.areaW[1] - dxScaled,
		]
		this.mandelbrot.areaH = [
			this.mandelbrot.areaH[0] - dyScaled,
			this.mandelbrot.areaH[1] - dyScaled,
		]
	}

	private resizeCanvas = () => {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
	}

	private render = () => {
		this.mandelbrot.render(this.canvas.width, this.canvas.height)
		requestAnimationFrame(this.render)
	}
}

new App()
