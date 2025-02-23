import {saveAs} from 'file-saver'
import {DrawerDocument} from '../Document/DrawerDocument'
import {DrawerHelpView} from './DrawerHelpView'

class DrawerMenuView {
	private readonly menuBar: HTMLDivElement

	constructor(
		private readonly appDocument: DrawerDocument,
		private readonly helpView: DrawerHelpView,
	) {
		this.menuBar = this.createMenuBar()
		document.body.append(this.menuBar)
	}

	private createMenuBar(): HTMLDivElement {
		const menuBar = document.createElement('div')
		menuBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f0f0f0;
            padding: 5px;
            z-index: 1000;
            display: flex;
            gap: 20px;
        `

		menuBar.append(this.createFileMenu())
		menuBar.append(this.createHelpButton())

		return menuBar
	}

	private createFileMenu(): HTMLDivElement {
		const fileMenu = document.createElement('div')
		const fileButton = this.createButton('File', () => this.toggleDropdown(fileDropdown))

		const fileDropdown = document.createElement('div')
		fileDropdown.style.display = 'none'
		fileDropdown.style.position = 'absolute'
		fileDropdown.style.background = '#fff'
		fileDropdown.style.border = '1px solid #ccc'
		fileDropdown.style.padding = '5px'

		fileDropdown.append(this.createButton('New', () => this.handleNew()))
		fileDropdown.append(this.createButton('Open', () => this.handleOpen()))

		const saveAsButton = this.createButton('Save as', () => this.toggleDropdown(saveAsDropdown))
		fileDropdown.append(saveAsButton)

		const saveAsDropdown = document.createElement('div')
		saveAsDropdown.style.display = 'none'
		saveAsDropdown.style.position = 'absolute'
		saveAsDropdown.style.background = '#fff'
		saveAsDropdown.style.border = '1px solid #ccc'
		saveAsDropdown.style.padding = '5px'

		saveAsDropdown.append(this.createButton('PNG', () => this.handleSavePng()))
		saveAsDropdown.append(this.createButton('BMP', () => this.handleSaveBmp()))
		saveAsDropdown.append(this.createButton('JPEG', () => this.handleSaveJpeg()))

		fileDropdown.append(saveAsDropdown)

		fileMenu.append(fileButton, fileDropdown)
		return fileMenu
	}

	private createHelpButton(): HTMLButtonElement {
		return this.createButton('Help', () => this.helpView.toggle())
	}

	private createButton(label: string, onClick: () => void): HTMLButtonElement {
		const button = document.createElement('button')
		button.textContent = label
		button.onclick = onClick
		return button
	}

	private toggleDropdown(dropdown: HTMLDivElement): void {
		dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none'
	}

	private handleNew(): void {
		this.appDocument.clearCanvas()
	}

	private handleOpen(): void {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/png, image/jpeg, image/bmp'
		input.onchange = async () => {
			const file = input.files?.[0]
			if (file) {
				try {
					const imageBitmap = await createImageBitmap(file)
					this.appDocument.loadImage(imageBitmap)
				}
				catch (e) {
					console.error(e)
					alert('Error loading image')
				}
			}
		}
		input.click()
	}

	private handleSavePng(): void {
		this.appDocument.getCanvas().toBlob(blob => {
			if (blob) {
				saveAs(blob, 'image.png')
			}
		}, 'image/png')
	}

	private handleSaveBmp(): void {
		this.appDocument.getCanvas().toBlob(blob => {
			if (blob) {
				saveAs(blob, 'image.bmp')
			}
		}, 'image/png')
	}

	private handleSaveJpeg(): void {
		this.appDocument.getCanvas().toBlob(blob => {
			if (blob) {
				saveAs(blob, 'image.jpg')
			}
		}, 'image/jpeg')
	}
}

export {
	DrawerMenuView,
}
