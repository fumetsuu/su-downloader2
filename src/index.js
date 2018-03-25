import { getDownloadLink } from './getDownloadLink'
import { initiateDownload } from './initiateDownload';

getDownloadLink('https://www.masterani.me/anime/watch/2758-darling-in-the-franxx/11')
	.then(link => {
		initiateDownload({
			url: link,
			path: './downloads/test.test'
		})
	})