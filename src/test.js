import { getDownloadLink } from './getDownloadLink'
const suDownloadItem = require('./suDownloadItem')

// const hey = new suDownloadItem({ url: 'http://ftp.iinet.net.au/test100MB.dat', path: './downloads/test.test'})

// hey.start()

// hey.on('progress', x => console.log('hey lol', x))


getDownloadLink('https://www.masterani.me/anime/watch/2758-darling-in-the-franxx/10')
	.then(link => {
		const hey = new suDownloadItem({ url: link, path: './downloads/franxx.mp4'})

		hey.start()

		hey.on('progress', x => console.log(x))
	})