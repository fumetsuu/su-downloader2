import request from 'request'
import { Observable } from 'rxjs/Observable'

/**
 * creates request object and events
 * @param {object} params - request params object
 */
export function createRequest(params) {
	return Observable.create(observer => {
		const req = request(params)
			.on('data', data => observer.next({ event: 'data', data }))
			.on('response', res => observer.next({ event: 'response', res }))
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
	return res$
}