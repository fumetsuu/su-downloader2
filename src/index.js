import { getDownloadLink } from './getDownloadLink'
import { initiateDownload } from './initiateDownload'
import { startDownload } from './startDownload'
import { sudPath } from './Utils'

const testPath = './downloads/test.mp4'
const testPathsud = sudPath(testPath)

// getDownloadLink('https://www.masterani.me/anime/watch/2758-darling-in-the-franxx/10')
// 	.then(link => {
// 		initiateDownload({
// 			url: link,
// 			path: testPath
// 		}).subscribe(
// 			x => console.log(x), null,
// 			() => {
// 				startDownload(testPathsud)
// 					.subscribe(x => console.log(x))
// 			})
// 	})


// initiateDownload({ url: 'http://www.sample-videos.com/text/Sample-text-file-1000kb.txt', path: './downloads/1mb.txt' })

// initiateDownload({ url: 'https://www.matomari.tk/api/0.4/src/', path: testPath})
// 	.subscribe(
// 		x => console.log('FROM INDXE ', x), err => console.log('START ERROROOOOOOO', err, err.code),
// 		() => {
// 			startDownload(testPathsud)
// 				.subscribe(() => console.log('x'), err => console.log('EREROEROROR', err, err.code))
// 		})

module.exports = {
	initiateDownload,
	startDownload,
	sudPath
}