import request from 'request'
import { Observable } from 'rxjs/Observable'
import { share } from 'rxjs/operators'
/**
 * creates request object and events
 * @param {object} params - request params object
 */
function createRequest(params) {
	return Observable.create(observer => {
		const req = request(params)
			.on('data', data => observer.next({ event: 'data', data }))
			.on('response', res => {
				let { statusCode } = res
				if(statusCode >= 400 && statusCode <= 512) {
					observer.error({ res, statusCode})
				} else {
					observer.next({ event: 'response', res })
				}
			})
			.on('error', err => observer.error(err))
			.on('complete', () => observer.complete())

		return () => req.abort() //clean up
	})
}

/**
 * returns response and data streams
 * @param {object} params - request params object 
 */
export function Request(params) {
	const res$ = createRequest(params)
	return res$.pipe(share())
}