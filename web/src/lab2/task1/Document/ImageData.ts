class ImageData {
	private readonly bitmap: ImageBitmap

	constructor(bitmap: ImageBitmap) {
		this.bitmap = bitmap
	}

	getWidth(): number {
		return this.bitmap.width
	}

	getHeight(): number {
		return this.bitmap.height
	}

	draw(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
		context.drawImage(this.bitmap, x, y, width, height)
	}
}

export {
	ImageData,
}