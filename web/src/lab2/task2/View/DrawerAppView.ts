import {DrawerDocument} from '../Document/DrawerDocument'
import {DrawerCanvasView} from './DrawerCanvasView'
import {DrawerHelpView} from './DrawerHelpView'
import {DrawerMenuView} from './DrawerMenuView'

class DrawerAppView {
	constructor(
		readonly appDocument: DrawerDocument,
	) {
		const helpView = new DrawerHelpView()
		const canvasView = new DrawerCanvasView(appDocument)
		new DrawerMenuView(appDocument, helpView, canvasView)
	}
}

export {DrawerAppView}