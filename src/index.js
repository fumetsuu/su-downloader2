import { getDownloadLink } from './getDownloadLink'
import { initiateDownload } from './initiateDownload'
import { startDownload } from './startDownload'
import { sudPath } from './Utils';

const testPath = './downloads/test.test'
const testPathsud = sudPath(testPath)

// getDownloadLink('https://www.masterani.me/anime/watch/2758-darling-in-the-franxx/11')
// 	.then(link => {
// 		initiateDownload({
// 			url: link,
// 			path: './downloads/test.test'
// 		})
// })
	
startDownload(testPathsud)
	