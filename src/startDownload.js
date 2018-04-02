import {  readMeta, getRequest, genMetaObservable } from './Utils'
import { share } from 'rxjs/operators'

/**
 * starts/resumes downloading from the specified .sud file
 * returns an observable that emits the progress of the download
 * @param {string} sudFile - existing .sud file created with initiateDownload
 */
export function startDownload(sudFile) {
	/**
	 * create file
	 */
	
	const readMeta$ = readMeta(sudFile)
	
	const request$ = getRequest(readMeta$)

	// request$.subscribe(x => console.log('REQUEST $$$$$$$$', x), err => console.log('RTEQUEST ERROR', err), () => console.log('REQWUEST CFOMPLETE'))

	const meta$ = genMetaObservable(request$, readMeta$).pipe(share())

	return meta$
}