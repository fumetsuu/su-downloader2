import { getDownloadLink } from './getDownloadLink'
const bytes = require('bytes')
const suDownloadItem = require('./suDownloadItem')
const log = require('single-line-log').stdout

const hey = new suDownloadItem({ url: 'http://ftp.iinet.net.au/test50MB.dat', path: './downloads/TESTSUD.test', concurrent: 18, throttleRate: 100 })

hey.start()

var maxSpeed = 0
var minSpeed = 0

hey.on('progress', eat)

hey.on('error', err => {
	console.log('IM AN ERROR THATS BEING DEAD BECAUSE AFTER RETRIED', err)
})

hey.on('finish', (x) => {
	eat(x)
	console.log('\nMAX SPEED REACHED SUDOWNLOADER2: ', bytes(maxSpeed)+'/s')
	console.log('\nMIN SPEED REACHED SUDOWNLOADER2: ', bytes(minSpeed)+'/s')	
})

function eat(x) {
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
	if(minSpeed == 0 && x.present.speed) minSpeed = x.present.speed
	if(x.present.speed > maxSpeed) maxSpeed = x.present.speed
	if(x.present.speed < minSpeed) minSpeed = x.present.speed
	consoleUpdate(`${prog.speed}   |   ${prog.downloaded}/${prog.total}   |  elapsed: ${prog.elapsed} | eta: ${prog.ETA}  |  ${prog.percentage}  |  past: ${prog.past}`)
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

function consoleUpdate(msg) {
	log(msg)
}