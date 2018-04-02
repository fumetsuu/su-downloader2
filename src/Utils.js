const fs = require('fs')
import { Request } from './Request'
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import { filter, pluck, take, mergeMap, map, share, tap, withLatestFrom, concatMap, concat, switchMap } from 'rxjs/operators'
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
	let { url, filesize, threads, positions } = meta
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
		var writeStream = fs.createWriteStream(meta.path, { flags: 'a', start: meta.positions[0] })
		console.log('start ', meta.positions[0])
		return writeDataMetaBuffer(writeStream, request$, meta)
	}))
	return a$
}

//gets remote file size by reading the response object
export const getFilesize = response$ => response$.pipe(pluck('headers', 'content-length'), take(1), share())

const getLocalFilesize = sudFile => fs.statSync(sudFile).size

//creates meta to be appended to .sud file
export function createMetaInitial(fd$, filesize$, options) {
	return filesize$.pipe(
		tap(x => {
			var filesize = parseInt(x)
			var meta = {
				url: options.url,
				path: options.path,
				sudPath: sudPath(options.path),
				filesize: filesize,
				threads: [[0, filesize]],
				positions: [0]
			}
			writeMeta(meta)
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
	var position = meta.positions[0]
	const e$ = request$.pipe(
		filter(x => x.data),
		concatMap(request => {
			writeStream.write(request.data)
			position += Buffer.byteLength(request.data)
			var newMeta = Object.assign({}, meta, { threads: [[0, filesize]], positions: [position] })
			writeMeta(newMeta)
			return Observable.of(JSON.stringify(newMeta))
		}
		)
	)
	return e$
}