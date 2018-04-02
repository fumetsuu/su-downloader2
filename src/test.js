import { getDownloadLink } from './getDownloadLink'
const bytes = require('bytes')
const suDownloadItem = require('./suDownloadItem')

// const hey = new suDownloadItem({ url: 'http://ftp.iinet.net.au/test500MB.dat', path: './downloads/test.test'})

// hey.start()

// hey.on('progress', x => console.log(x))


getDownloadLink('https://www.masterani.me/anime/watch/2879-flcl-alternative/1', true)
	.then(link => {
		const hey = new suDownloadItem({ url: link, path: './downloads/flcl.mp4'})

		hey.start()
		
		hey.on('progress', x => {
			var prog = {
				SPEED: bytes(x.present.speed)+'/s',
				DOWNLOADED: bytes(x.total.downloaded),
				'TOTAL SIZE': bytes(x.total.size),
				percentage: x.total.completed+'%',
				elapsed: Math.ceil((x.present.time)),
				remaining: Math.ceil((x.future.remaining)),
				past: bytes(x.past.downloaded)
			}
			console.log(JSON.stringify(prog))
		})
	})