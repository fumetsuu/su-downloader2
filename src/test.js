import { getDownloadLink } from './getDownloadLink'
const bytes = require('bytes')
const suDownloadItem = require('./suDownloadItem')

// const hey = new suDownloadItem({ url: 'http://ftp.iinet.net.au/test100MB.dat', path: './downloads/test.test', concurrent: 18, throttleRate: 100 })

// hey.start()

// hey.on('progress', x => {
// 	var prog = {
// 		speed: bytes(x.present.speed)+'/s',
// 		downloaded: bytes(x.total.downloaded),
// 		total: bytes(x.total.size),
// 		percentage: x.total.completed+'%',
// 		elapsed: Math.round(x.present.time)+'s',
// 		ETA: Math.round(x.future.eta)+'s',
// 		remaining: x.future.remaining,
// 		past: bytes(x.past.downloaded)
// 	}
// 	consoleUpdate(`${prog.speed}  .........   |   ${prog.downloaded}/${prog.total}  .........  |  elapsed: ${prog.elapsed}  ........... | eta: ${prog.ETA}`)
// })


getDownloadLink('https://www.masterani.me/anime/watch/2768-yowamushi-pedal-glory-line/13', true)
	.then(link => {
		const hey = new suDownloadItem({ url: link, path: './downloads/flcl.mp4', concurrent: 1, throttleRate: 100 })

		hey.start()
		
		hey.on('progress', x => {
			var prog = {
				speed: bytes(x.present.speed)+'/s',
				downloaded: bytes(x.total.downloaded),
				total: bytes(x.total.size),
				percentage: x.total.completed+'%',
				elapsed: Math.round(x.present.time),
				ETA: Math.round(x.future.eta),
				remaining: x.future.remaining,
				past: bytes(x.past.downloaded)
			}
			consoleUpdate(`${prog.speed}  .........   |   ${prog.downloaded}/${prog.total}  .........  |  elapsed: ${prog.elapsed}  ........... | eta: ${prog.ETA}`)
		})
	})

function consoleUpdate(msg) {
	process.stdout.clearLine()
	process.stdout.cursorTo(0)
	process.stdout.write(msg)
}