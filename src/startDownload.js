const fs = require('fs')
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { getResponse, getFilesize, createMetaInitial, sudPath, readMeta, getRequest, genMetaObservable } from './Utils'
import { mergeAll, tap } from 'rxjs/operators'

/**
 * starts/resumes downloading from the specified .sud file
 * returns an observable that emits the progress of the download
 * @param {string} sudFile - existing .sud file created with initiateDownload
 */
export function startDownload(sudFile) {
	/**
	 * create file
	 */
	
	const fd$ = bindNodeCallback(fs.open)(sudFile, 'r+')
	
	const readMeta$ = readMeta(sudFile)
	
	const request$ = getRequest(readMeta$)

	const meta$ = genMetaObservable(request$, readMeta$).subscribe(x => console.log(x), err => console.log('errr', err))
}