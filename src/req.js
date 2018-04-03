const fs = require('fs')
const request = require('request')
const progress = require('request-progress')
const bytes = require('bytes')
const log = require('single-line-log').stdout

var dlp = fs.createWriteStream('./downloads/TESTREQ.test')
var dlReq = request('http://ftp.iinet.net.au/test50MB.dat')

var maxSpeed = 0
var minSpeed = 0

progress(dlReq, { throttle: 100 })
	.on('progress', (dlState => { 
		var prog = {
			status: 'DOWNLOADING',
			speed: bytes(dlState.speed)+'/s',
			downloaded: bytes(dlState.size.transferred),
			total: bytes(dlState.size.total),
			percentage: (100*(dlState.percent)).toFixed(2),
			elapsed: Math.ceil((dlState.time.elapsed)),
			remaining: Math.ceil((dlState.time.remaining))
		}
		if(minSpeed == 0 && dlState.speed) minSpeed = dlState.speed
		if(dlState.speed > maxSpeed) maxSpeed = dlState.speed
		if(dlState.speed < minSpeed) minSpeed = dlState.speed
		consoleUpdate(`${prog.speed}    |   ${prog.downloaded}/${prog.total}  |  elapsed: ${prog.elapsed}   | eta: ${prog.remaining}   |  ${prog.percentage}%`)
	}))
	.on('end', () => {
		console.log('\nMAX SPEED ACHIEVED REQUEST: ', bytes(maxSpeed)+'/s')
		console.log('\nMIN SPEED ACHIEVED REQUEST: ', bytes(minSpeed)+'/s')
	})
	.pipe(dlp)

function consoleUpdate(msg) {
	log(msg)
}