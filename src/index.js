import { getDownloadLink } from './getDownloadLink'
import { initiateDownload } from './initiateDownload'
import { startDownload } from './startDownload'
import { sudPath } from './Utils'

const testPath = './downloads/test.jpg'
const testPathsud = sudPath(testPath)

// getDownloadLink('https://www.masterani.me/anime/watch/2758-darling-in-the-franxx/10')
// 	.then(link => {
// 		initiateDownload({
// 			url: link,
// 			path: './downloads/test.test'
// 		})
// 	})

// initiateDownload({ url: 'https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg', path: './downloads/test.jpg'})

startDownload(testPathsud)