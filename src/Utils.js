const fs = require('fs')
import { Request } from './Request'
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/from'
import { filter, pluck, take, map, share, tap, withLatestFrom, concatMap, concat } from 'rxjs/operators'
import { merge } from 'rxjs/observable/merge'
import { forkJoin } from 'rxjs/observable/forkJoin'

/**
 * public util method to get .sud file
 * @param {string} filepath 
 */
export const sudPath = filepath => `${filepath}.sud`

export const filterPluck = ($, f, p) => $.pipe(filter(x => x.event == f), pluck(p))

const bufferSize = 1024 * 4
const fsWrite = bindNodeCallback(fs.write)
const fsRead = bindNodeCallback(fs.read)
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
	let { url, filesize, threads, positions } = meta
	var headers = { range: calculateRange(threads, positions) }
	return {
		url,
		headers
	}
}

export function getRequest(readMeta$) {
	return readMeta$.pipe(concatMap(readMeta => {
		var meta = metaToJSON(readMeta[1])
		var params = genRequestParams(meta)
		return Request(params)
	}))
}

export function genMetaObservable(fd$, request$, readMeta$) {
	return forkJoin(fd$, readMeta$).pipe(
		concatMap(([fd, readMeta]) => request$.pipe(
			map(request => {
				var meta = metaToJSON(readMeta[1])
				var writeStream = fs.createWriteStream(readMeta.sudPath, { flags: 'r+', fd, start: meta.positions[0] })
				return writeDataMetaBuffer(writeStream, request, meta)
			})
		))
	)
}

//gets remote file size by reading the response object
export const getFilesize = response$ => response$.pipe(pluck('headers', 'content-length'), take(1), share())

const getLocalFilesize = sudFile => fs.statSync(sudFile).size

//creates meta to be appended to .sud file
export function createMetaInitial(fd$, filesize$, options) {
	return filesize$.pipe(
		withLatestFrom(fd$),
		concatMap(x => {
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
			return writeMeta(fd, meta)
		}))
}

//write meta to .sud file
function writeMeta(fd, meta) {
	var bufferData = new Buffer(bufferSize)
	bufferData.fill(' ')
	bufferData.write(JSON.stringify(meta))
	var position = meta.positions[0]
	return fsWrite(fd, bufferData, 0, bufferSize, position)
}

export function readMeta(fd$, sudFile) {
	return fd$.pipe(concatMap(fd => {
		const actualSize = getLocalFilesize(sudFile)
		const position = actualSize - bufferSize
		var bufferRead = new Buffer(bufferSize)
		return fsRead(fd, bufferRead, 0, bufferSize, position).pipe(share())
	}))
}

function writeDataMetaBuffer(writeStream, request, meta) {
	const wsWrite = bindNodeCallback(writeStream.write)
	var filesize = meta.filesize
	var position = meta.positions[0]
	if(request.data) {
		var dataWrite$ = wsWrite(request.data)
	} else {
		var dataWrite$ = Observable.create(o => o.next(request))
	}
	var newMeta = Object.assign({}, meta, { threads: [[position, filesize]], positions: [position] })
	var bufferData = new Buffer(bufferSize)
	bufferData.fill(' ')
	bufferData.write(JSON.stringify(newMeta))
	var metaWrite$ = wsWrite(bufferData)
	// return merge(metaWrite$, dataWrite$)
	return dataWrite$
}