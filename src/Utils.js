const fs = require('fs')
import { Request } from './Request'
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import { filter, pluck, take, share, tap, concatMap } from 'rxjs/operators'

/**
 * public util method to get .sud file
 * @param {string} filepath 
 */
export const sudPath = filepath => `${filepath}.sud`

export const filterPluck = ($, f, p) => $.pipe(filter(x => x.event == f), pluck(p))

const fsReadFile = bindNodeCallback(fs.readFile)
const metaToJSON = meta => JSON.parse(meta.toString())

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
	let { url, threads } = meta
	var positions = [getLocalFilesize(meta.path)]
	var headers = { range: calculateRange(threads, positions) }
	return {
		url,
		headers
	}
}

export function getRequest(readMeta$) {
	return readMeta$.pipe(concatMap(readMeta => {
		var meta = metaToJSON(readMeta)
		var params = genRequestParams(meta)
		return Request(params)
	}))
}

export function genMetaObservable(request$, readMeta$) {
	const a$ = readMeta$.pipe(concatMap(readMeta => {
		var meta = metaToJSON(readMeta)
		var startPos = getLocalFilesize(meta.path)
		var writeStream = fs.createWriteStream(meta.path, { flags: 'a', start: startPos })
		return writeDataMetaBuffer(writeStream, request$, meta)
	}))
	return a$
}

//gets remote file size by reading the response object
export const getFilesize = response$ => response$.pipe(take(1), pluck('headers', 'content-length'))

const getLocalFilesize = file => fs.existsSync(file) ? fs.statSync(file).size : 0

//creates meta to be written to .sud file
export function createMetaInitial(filesize$, options) {
	return filesize$.pipe(
		concatMap(x => {
			var filesize = parseInt(x)
			var meta = {
				url: options.url,
				path: options.path,
				sudPath: sudPath(options.path),
				filesize,
				threads: [[0, filesize]]
			}
			writeMeta(meta)
			return Observable.of(meta)
		}))
}

//write meta to .sud file
function writeMeta(meta) {
	var bufferData = Buffer.from(JSON.stringify(meta))
	fs.writeFile(meta.sudPath, bufferData, err => {
		if(err) throw err
		console.log('meta written')
	})
}

export function readMeta(sudFile) {
	return fsReadFile(sudFile)
}

function writeDataMetaBuffer(writeStream, request$, meta) {
	var filesize = meta.filesize
	var position = getLocalFilesize(meta.path)
	const e$ = request$.pipe(
		filter(x => x.data),
		concatMap(request => {
			writeStream.write(request.data)
			position += Buffer.byteLength(request.data)
			if(position == filesize) { fs.unlinkSync(meta.sudPath) }
			var newMeta = Object.assign({}, meta, { threads: [[0, filesize]], positions: [position] })
			return Observable.of(newMeta)
		})
	)
	return e$
}