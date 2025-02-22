class ImageViewerHelpView {
	constructor() {
		this.createUI()
	}

	private createUI() {
		const helpText = document.createElement('div')
		helpText.style.cssText = `
			position: fixed;
			inset: 30px 0px 0px;
            background: red;
        `
		helpText.innerText = 'Hello world!'
		document.body.append(helpText)
	}
}

export {
	ImageViewerHelpView,
}