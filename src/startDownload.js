const fs = require('fs')
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { getResponse, getFilesize, createMetaInitial, sudPath, readMeta } from './Utils'

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
	
	readMeta(fd$, sudFile)
}