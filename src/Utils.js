const fs = require('fs')
const concat = require('./concat')
import { Request } from './Request'
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/throw'
import { filter, pluck, take, share, tap, concatMap, combineAll, combineLatest, mergeAll, map, mergeMap } from 'rxjs/operators'

/**
 * public util method to get .sud file
 * @param {string} filepath 
 */
export const sudPath = filepath => `${filepath}.sud`
const partialPath = (filepath, index) => `${filepath}.PARTIAL${index}`

export const filterPluck = ($, f, p) => $.pipe(filter(x => x.event == f), pluck(p))

const fsReadFile = bindNodeCallback(fs.readFile)
const metaToJSON = meta => JSON.parse(meta.toString())

//returns an observable with request's response object
export function getResponse(params) {
	const res$ = Request(params.url)
	return filterPluck(res$, 'response', 'res').pipe(take(1))
}

function calculateRange(thread, position) {
	var end = thread[1]
	var start = thread[0] + position
	return `bytes=${start}-${end}`
}

function genRequestParams(meta, threadIdx) {
	let { url, threads } = meta
	var position = getLocalFilesize(partialPath(meta.path, threadIdx))
	var headers = { range: calculateRange(threads[threadIdx], position) }
	return {
		url,
		headers
	}
}

function isValidThread(meta, threadIdx) {
	var position = getLocalFilesize(partialPath(meta.path, threadIdx))
	var thread = meta.threads[threadIdx]
	var end = thread[1]
	var start = thread[0] + position
	return start < end
}

export function getRequest(readMeta$) {
	return readMeta$.pipe(
		concatMap(readMeta => {
			var meta = metaToJSON(readMeta)
			var Requests$$ = Observable.of(
				meta.threads
					.map((thread, threadIdx) => {
						if(!isValidThread(meta,threadIdx)) return 'COMPLETED'
						var params = genRequestParams(meta, threadIdx)
						return Request(params)
					})).pipe(combineAll())
			return Requests$$
		}),
		combineAll()
	)
}

export function genMetaObservable(request$, readMeta$) {
	const a$ = readMeta$.pipe(
		mergeMap(readMeta => {
			var meta = metaToJSON(readMeta)
			var writeBuffers$$ = Observable.of(
				meta.threads
					.map((thread, threadIdx) => {
						var partialpath = partialPath(meta.path, threadIdx)
						var startPos = getLocalFilesize(partialpath)
						var writeStream = fs.createWriteStream(partialpath, { flags: 'a', start: startPos })
						return writeDataMetaBuffer(writeStream, request$, meta, threadIdx)
					})).pipe(combineLatest(), mergeAll())
			return writeBuffers$$
		}),
		mergeAll(),
		combineAll(),
		map(metas => {
			var basemeta = metas[0].baseMeta
			var positions = metas.map(x => x.position)
			var totalDownloaded = metas.map((x, i) => x.position - x.baseMeta.threads[i][0]).reduce((a, b) => a+b)
			if(totalDownloaded >= basemeta.filesize) {
				var partials = []
				for(var i = 0; i < metas.length; i++) {
					partials.push(partialPath(basemeta.path, i))
				}
				concat(partials, basemeta.path, true, true).then(() => {
					console.log('done rebuilding')
					return Object.assign({}, basemeta, { positions, finished: true })
				})
				fs.unlinkSync(basemeta.sudPath)
			}
			var meta = Object.assign({}, basemeta, { positions })
			return meta
		})
	)
	return a$
}

//gets remote file size by reading the response object
export const getFilesize = response$ => response$.pipe(take(1), pluck('headers', 'content-length'))

const getLocalFilesize = file => fs.existsSync(file) ? fs.statSync(file).size : 0

function genInitialThreads(filesize, concurrent) {
	if(concurrent == 1) return [[0, filesize]]
	var divSize = Math.floor(filesize / concurrent)
	var threads = new Array(concurrent)
	threads[0] = [0, divSize]
	for(var i = 1; i < concurrent -1; i++) {
		threads[i] = [divSize*i+1, divSize*(i+1)]
	}
	threads[concurrent-1] = [threads[concurrent-2][1]+1, filesize]
	return threads
}

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
				threads: genInitialThreads(filesize, options.concurrent || 4)
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
	})
}

export function readMeta(sudFile) {
	return fsReadFile(sudFile).pipe(share())
}

function writeDataMetaBuffer(writeStream, request$, meta, threadIdx) {
	var position = getLocalFilesize(partialPath(meta.path, threadIdx)) + meta.threads[threadIdx][0]
	if(!isValidThread(meta, threadIdx)) {
		return Observable.of({ baseMeta: meta, position})
	}	
	const e$ = request$.pipe(
		concatMap(request => {
			return request[threadIdx].pipe(
				filter(x => x.event == 'data'),
				concatMap(x => {
					writeStream.write(x.data)
					position += Buffer.byteLength(x.data)
					return Observable.of({ baseMeta: meta, position })
				})
			)
		})
	)
	return e$
}