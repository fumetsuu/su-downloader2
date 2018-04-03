import { getDownloadLink } from './getDownloadLink'
const bytes = require('bytes')
const suDownloadItem = require('./suDownloadItem')
// const log = require('single-line-log').stdout
require('draftlog').into(console)

const sud = require('./suDownloader')

sud.QueueDownload({ key: 'dead anime', url: 'https://www7.mp4upload.com:282/d/scxtfy3mz3b4quuockvbqjcbkl667cv64myaywi24aplacvwbewkx7pk/[kooritsukai-UMU] Fate Extra Last Encore - 01 [720p].mp4', path: './downloads/TESTSUD.test', concurrent: 4, throttleRate: 100 })
// sud.QueueDownload({ key: '50mb iinet 2', url: 'http://ftp.iinet.net.au/test50MB.dat', path: './downloads/TESTSUD1.test', concurrent: 18, throttleRate: 100 })

var hey = sud.getActiveDownload('dead anime')
// var hey1 = sud.getActiveDownload('50mb iinet 2')

// var hey = new suDownloadItem({ url: 'http://ftp.iinet.net.au/test50MB.dat', path: './downloads/TESTSUD.test', concurrent: 18, throttleRate: 100 })

// hey.start()
var heydraft = console.draft('dead anim,e')

hey.on('progress', x => {
	eat(x, heydraft)
})

setTimeout(() => {
	console.log('clearing?')
	sud.clearDownload('dead anime', true)
}, 20000)

hey.on('error', err => {
	console.log('IM AN ERROR THATS BEING DEAD BECAUSE AFTER RETRIED', err)
})

hey.on('finish', x => {
	eat(x, heydraft)
	setInterval(() => console.log('OH JUST WAITIN U KNOW'), 1000)
})

// var heydraft1 = console.draft('DOWNLOAD 50MB IINET 2')
// hey1.on('progress', x => eat(x, heydraft1))

// hey1.on('error', err => {
// 	console.log('IM AN ERROR THATS BEING DEAD BECAUSE AFTER RETRIED', err)
// })
// hey1.on('finish', x => eat(x, heydraft1))


function eat(x, draft) {
	var prog = {
		speed: bytes(x.present.speed)+'/s',
		downloaded: bytes(x.total.downloaded),
		total: bytes(x.total.size),
		percentage: (x.total.completed).toFixed(2)+'%',
		elapsed: Math.round(x.present.time)+'s',
		ETA: Math.round(x.future.eta)+'s',
		remaining: x.future.remaining,
		past: bytes(x.past.downloaded)
	}
	draft(`${prog.speed}   |   ${prog.downloaded}/${prog.total}   |  elapsed: ${prog.elapsed} | eta: ${prog.ETA}  |  ${prog.percentage}  |  past: ${prog.past}`)
}



// getDownloadLink('https://www.masterani.me/anime/watch/2768-yowamushi-pedal-glory-line/13', true)
// 	.then(link => {
// 		const hey = new suDownloadItem({ url: link, path: './downloads/flcl.mp4', range: 10, throttleRate: 100 })

// 		hey.start()
		
// 		hey.on('progress', x => {
// 			var prog = {
// 				speed: bytes(x.present.speed)+'/s',
// 				downloaded: bytes(x.total.downloaded),
// 				total: bytes(x.total.size),
// 				percentage: (x.total.completed).toFixed(2)+'%',
// 				elapsed: Math.round(x.present.time),
// 				ETA: Math.round(x.future.eta),
// 				remaining: x.future.remaining,
// 				past: bytes(x.past.downloaded)
// 			}
// 			consoleUpdate(`${prog.speed}  .........   |   ${prog.downloaded}/${prog.total}  .........  |  elapsed: ${prog.elapsed}  ........... | eta: ${prog.ETA}`)
// 		})
// 	})
