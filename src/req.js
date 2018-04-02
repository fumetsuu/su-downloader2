const fs = require('fs')
import { getDownloadLink } from './getDownloadLink'
const request = require('request')
const progress = require('request-progress')
const bytes = require('bytes')

getDownloadLink('https://www.masterani.me/anime/watch/2879-flcl-alternative/1', true)
	.then(link => {
		var dlp = fs.createWriteStream('./downloads/flclreq.mp4')
		var dlReq = request(link)
		progress(dlReq, { throttle: 500 })
			.on('progress', (dlState => { 
				var prog = {
					status: 'DOWNLOADING',
					speed: bytes(dlState.speed)+'/s',
					progressSize: bytes(dlState.size.transferred),
					totalSize: bytes(dlState.size.total),
					percentage: (100*(dlState.percent)).toFixed(2),
					elapsed: Math.ceil((dlState.time.elapsed)),
					remaining: Math.ceil((dlState.time.remaining))
				}
				console.log(JSON.stringify(prog))
			}))
			.pipe(dlp)
	})


