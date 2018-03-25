import { Request } from './Request'
import { filter, pluck, take } from 'rxjs/operators'

export const filterPluck = ($, f, p) => $.pipe(filter(x => x.event == f), pluck(p))

//returns an observable with request's response object
export function getResponse(params) {
	const res$ = Request(params.url)
	return filterPluck(res$, 'response', 'res').pipe(take(1))
}

//gets remote file size by reading the response object
export function getFileSize(response$) {
	response$.pipe(pluck('headers', 'content-length')).subscribe(console.log)
}