const fs = require('fs')
import { Request } from './Request'
import { filter, pluck, take, map, withLatestFrom } from 'rxjs/operators'

/**
 * public util method to get .sud file
 * @param {string} filepath 
 */
export const sudPath = filepath => `${filepath}.sud`

export const filterPluck = ($, f, p) => $.pipe(filter(x => x.event == f), pluck(p))

const bufferSize = 1024 * 4

//returns an observable with request's response object
export function getResponse(params) {
	const res$ = Request(params.url)
	return filterPluck(res$, 'response', 'res').pipe(take(1))
}

//gets remote file size by reading the response object
export const getFilesize = response$ => response$.pipe(pluck('headers', 'content-length'), take(1))

const getLocalFilesize = sudFile => fs.statSync(sudFile).size

//creates meta to be appended to .sud file
export function createMetaInitial(fd$, filesize$, options) {
	filesize$.pipe(
		withLatestFrom(fd$))
		.subscribe(x => {
			var filesize = parseInt(x[0])
			var fd = x[1]
			var meta = {
				url: options.url,
				path: options.path,
				sudPath: sudPath(options.path),
				filesize: filesize,
				threads: [0, filesize],
				positions: [0]
			}
			writeMetaInitial(fd, meta)
		})
}

//write meta to .sud file
function writeMetaInitial(fd, meta) {
	var bufferData = new Buffer(bufferSize)
	bufferData.fill(' ')
	bufferData.write(JSON.stringify(meta))
	fs.write(fd, bufferData, 0, bufferSize, 0, err => {
		if(err) console.log(err)
		else console.log('written initial data')
	})
}

export function readMeta(fd$, sudFile) {
	fd$.subscribe(fd => {
		const actualSize = getLocalFilesize(sudFile)
		const position = actualSize - bufferSize
		var bufferRead = new Buffer(bufferSize)
		fs.read(fd, bufferRead, 0, bufferSize, position, (err, bytesRead, buffer) => {
			if(err) console.log(err)
			else {
				var meta = JSON.parse(buffer.toString())
				//create request params based off thread positions
			}
		})
	})
}