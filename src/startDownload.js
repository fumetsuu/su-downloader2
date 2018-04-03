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

	const meta$ = genMetaObservable(request$, readMeta$).pipe(share())

	return meta$
}