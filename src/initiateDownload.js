const fs = require('fs')
import { getResponse, getFileSize } from './Utils'
/**
 * Initiates a download, creating a new .sud file which has relevant metadata appended.
 * @param {object} options 
 * @param {string} options.url - url to download
 * @param {string} options.path - file save path (relative)
 * @param {number} [options.range] - number of requests to make
 */
export function initiateDownload(options) {
	const filepath = options.path

	/**
	 * create file
	 */
	const fd = fs.openSync(filepath, 'w')
	
	const response$ = getResponse(options)
	
	const filesize = getFileSize(response$)

}