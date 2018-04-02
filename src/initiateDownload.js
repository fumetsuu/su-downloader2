import { getResponse, getFilesize, createMetaInitial } from './Utils'
import { share } from 'rxjs/operators'
/**
 * Initiates a download, creating a new .sud file which has relevant metadata appended. Does not return anything.
 * @param {object} options 
 * @param {string} options.url - url to download
 * @param {string} options.path - file save path (relative)
 * @param {[number=4]} options.concurrent - number of concurrent downloads
 */
export function initiateDownload(options) {
	
	const response$ = getResponse(options)
	
	const filesize$ = getFilesize(response$)

	//creates meta to be appended to .sud file, contains path, sudPath, url, filesize and thread positions
	return createMetaInitial(filesize$, options).pipe(share())
}