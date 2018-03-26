const fs = require('fs')
import { Request } from './Request'
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'
import { filter, pluck, take, map, withLatestFrom, concatMap } from 'rxjs/operators'

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

function calculateRange(threads, positions) {
	var start = positions[0]
	var end = threads[0][1]
	return `bytes=${start}-${end}`
}

function genRequestParams(meta) {
	let { url, filesize, threads, positions } = meta
	var headers = { range: calculateRange(threads, positions) }
	return {
		url,
		headers
	}
}

export function getDataFromRequest(readMeta$) {
	return readMeta$.pipe(concatMap(readMeta => {
		var meta = JSON.parse(readMeta[1].toString())
		var params = genRequestParams(meta)
		return Request(params)
	}))
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
				threads: [[0, filesize]],
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
	var fsRead = bindNodeCallback(fs.read)
	return fd$.pipe(concatMap(fd => {
		const actualSize = getLocalFilesize(sudFile)
		const position = actualSize - bufferSize
		var bufferRead = new Buffer(bufferSize)
		return fsRead(fd, bufferRead, 0, bufferSize, position)
	}))
}