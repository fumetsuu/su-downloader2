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
// 			path: './downloads/test.mp4'
// 		}).subscribe(
// 			x => console.log(x), null,
// 			() => {
// 				startDownload(testPathsud)
// 					.subscribe(x => console.log(x))
// 			})
// 	})


// initiateDownload({ url: 'http://www.sample-videos.com/text/Sample-text-file-1000kb.txt', path: './downloads/1mb.txt' })

// initiateDownload({ url: 'https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg', path: './downloads/test.jpg'})
// 	.subscribe(
// 		x => console.log('FROM INDXE ', x), null,
// 		() => {
// 			startDownload(testPathsud)
// 				.subscribe(x => console.log('from inde x  starttt', x))
// 		})

module.exports = {
	initiateDownload,
	startDownload,
	sudPath
}