const fs = require('fs')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const suD = require('./')

function suDownloadItem(options) {
	util.inherits(suDownloadItem, EventEmitter)

	this.meta = {}

	this.options = {
		key: options.key || null,
		url: options.url,
		path: options.path,
		sudPath: suD.sudPath(options.path),
		throttleRate: 500
	}

	this.start = () => {
		let { sudPath, url, throttleRate } = this.options
		let dlPath = this.options.path
		fs.access(sudPath, err => {
			if(!err) this.downloadFromExisting()
			else { 
				suD.initiateDownload({ url, path: dlPath })
					.subscribe(x => {
						console.log('from init ', x)
						this.setMeta(x)
						// this.updateInterval = setInterval(this.handleProgress, throttleRate)
						this.downloadFromExisting()
					})
			}
		})
	}

	this.downloadFromExisting = () => {
		console.log('hi lol')
	}

	this.setMeta = meta => {
		let { filesize, threads, positions } = meta
		this.meta = { filesize, threads, positions }
	}

	this.handleProgress = () => {
		console.log(this.meta)
	}
}

module.exports = suDownloadItem