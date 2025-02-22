import {ImageViewerDocument} from '../Document/ImageViewerDocument'
import {ImageViewerHelpView} from './ImageViewerHelpView'
import {ImageViewerImageView} from './ImageViewerImageView'
import {ImageViewerMenuView} from './ImageViewerMenuView'

class ImageViewerAppView {
	constructor(
		readonly appDocument: ImageViewerDocument,
	) {
		new ImageViewerMenuView(appDocument)
		new ImageViewerHelpView()
		new ImageViewerImageView(appDocument)
	}
}

export {
	ImageViewerAppView,
}