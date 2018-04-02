import { getDownloadLink } from './getDownloadLink'
const bytes = require('bytes')
const suDownloadItem = require('./suDownloadItem')

const hey = new suDownloadItem({ url: 'http://ftp.iinet.net.au/test100MB.dat', path: './downloads/test.test', concurrent: 10 })

hey.start()

hey.on('progress', x => {
	var prog = {
		speed: bytes(x.present.speed)+'/s',
		downloaded: bytes(x.total.downloaded),
		total: bytes(x.total.size),
		percentage: x.total.completed+'%',
		elapsed: x.present.time,
		ETA: x.future.eta,
		remaining: x.future.remaining,
		past: bytes(x.past.downloaded)
	}
	console.log(`${prog.speed}  .........   |   ${prog.downloaded}/${prog.total}  .........  |  elapsed: ${prog.elapsed}  ........... | eta: ${prog.ETA}`)
})


// getDownloadLink('https://www.masterani.me/anime/watch/2837-uma-musume-pretty-derby-tv/1', true)
// 	.then(link => {
// 		const hey = new suDownloadItem({ url: link, path: './downloads/flcl.mp4', concurrent: 8, throttleRate: 100 })

// 		hey.start()
		
// 		hey.on('progress', x => {
// 			var prog = {
// 				speed: bytes(x.present.speed)+'/s',
// 				downloaded: bytes(x.total.downloaded),
// 				total: bytes(x.total.size),
// 				percentage: x.total.completed+'%',
// 				elapsed: x.present.time,
// 				ETA: x.future.eta,
// 				remaining: x.future.remaining,
// 				past: bytes(x.past.downloaded)
// 			}
// 			console.log(`${prog.speed}  .........   |   ${prog.downloaded}/${prog.total}  .........  |  elapsed: ${prog.elapsed}  ........... | eta: ${prog.ETA}`)
// 		})
// 	})