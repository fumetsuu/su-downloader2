const fs = require('fs')
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback'
import { getResponse, getFilesize, createMetaInitial, sudPath } from './Utils'
/**
 * Initiates a download, creating a new .sud file which has relevant metadata appended. Does not return anything.
 * @param {object} options 
 * @param {string} options.url - url to download
 * @param {string} options.path - file save path (relative)
 */
export function initiateDownload(options) {
	const filepath = options.path

	/**
	 * create file
	 */
	
	const fd$ = bindNodeCallback(fs.open)(sudPath(filepath), 'w')
	
	const response$ = getResponse(options)
	
	const filesize$ = getFilesize(response$)

	//creates meta to be appended to .sud file, contains path, sudPath, url, filesize and thread positions
	return createMetaInitial(fd$, filesize$, options)
}