import { getDownloadLink } from './getDownloadLink'
const bytes = require('bytes')
const mtdD = require('./mtdD')
const log = require('single-line-log').stdout

const hey = new mtdD({ url: 'http://ftp.iinet.net.au/test50MB.dat', path: './downloads/TESTMTD.test', concurrent: 12, throttleRate: 100 })

hey.start()

var maxSpeed = 0
var minSpeed = 0

hey.on('progress', x => {
	var prog = {
		speed: bytes(x.present.speed)+'/s',
		downloaded: bytes(x.total.downloaded),
		total: bytes(x.total.size),
		percentage: (x.total.completed).toFixed(2)+'%',
		elapsed: Math.round(x.present.time / 1000)+'s',
		ETA: Math.round(x.future.eta)+'s',
		remaining: x.future.remaining,
		past: bytes(x.past.downloaded)
	}
	if(minSpeed == 0 && x.present.speed) minSpeed = x.present.speed
	if(x.present.speed > maxSpeed) maxSpeed = x.present.speed
	if(x.present.speed < minSpeed) minSpeed = x.present.speed
	consoleUpdate(`${prog.speed}  |   ${prog.downloaded}/${prog.total} |  elapsed: ${prog.elapsed} | eta: ${prog.ETA} |  ${prog.percentage}`)
})

hey.on('finish', () => {
	console.log('\nMAX SPEED REACHED MTDOWNLOADER: ', bytes(maxSpeed)+'/s')
	console.log('\nMIN SPEED REACHED MTDOWNLOADER: ', bytes(minSpeed)+'/s')
})

function consoleUpdate(msg) {
	log(msg)
}