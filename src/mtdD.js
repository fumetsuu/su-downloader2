const fs = require('fs')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const muxer = require('muxer')
const mtd = require('mt-downloader')

function suDownloadItem(options) {
	util.inherits(suDownloadItem, EventEmitter)

	this.meta = {}

	this.status = 'NOT YET STARTED'
	
	this.options = {
		key: options.key,
		url: options.url,
		path: options.path,
		temppath: options.temppath,
		mtdpath: mtd.MTDPath(options.path),
		range: options.range || 1,
		throttleRate: options.throttleRate || 501,
		retry: options.retry || 5
	}

	this.retried = 0
	this.timesZero = 0

	this.stats = {
		time: {
			start: 0,
			end: 0
		},
		total: {
			size: 0,
			downloaded: 0,
			completed: 0
		},
		past: {
			downloaded: 0
		},
		present: {
			deltaDownloaded: 0,
			downloaded: 0,
			time: 0,
			speed: 0,
			averageSpeed: 0
		},
		future: {
			remaining: 0,
			eta: 0
		}
	}

	this.start = () => {
		this.status = 'DOWNLOADING'
		let dlopts = this.options
		fs.access(dlopts.mtdpath, err => {
			if(!err) {
				this.downloadFromExisting()
			} else {
				this.initDownloader = mtd.CreateMTDFile({ url: dlopts.url, path: dlopts.path, range: dlopts.range, metaWrite: dlopts.throttleRate }).subscribe(
					() => {},
					err => { if(err) throw err },
					() => { this.downloadFromExisting() }
				)
			}

			this.calculateStartTime()
		})
	}

	this.downloadFromExisting = () => {
		this.status = 'DOWNLOADING'
		let dlopts = this.options
		this.mtDownloader = mtd.DownloadFromMTDFile(dlopts.mtdpath)
		let [{response$, meta$}] = muxer.demux(this.mtDownloader, 'response$', 'meta$')

		response$
			.take(1)
			.subscribe(
				x => {
					this.retried = 0
					this.emit('start', x)
					this.updateInterval = setInterval(this.handleProgress, dlopts.throttleRate)
				},
				err => {
					this.handleError(err)
				}
			)
			
		meta$
			.take(1)
			.subscribe(
				response => {
					this.calculateInitialStats(response)
				},
				err => { 
					this.handleError(err)
				}
			)

		this.progressSubscription = meta$
			.subscribe(
				response => {
					this.setMeta(response)
				},
				err => { 
					this.handleError(err)
				},
				() => console.log(dlopts.key, ' finished early ?')
			)

	}

	this.pause = () => {
		if(this.updateInterval) {
			clearInterval(this.updateInterval)
			this.updateInterval = null
		}
		this.status = 'PAUSED'
		this.emit('pause')
		if(this.progressSubscription) {
			this.progressSubscription.dispose()
		}
	}

	this.restart = () => {
		console.log("restarting ===============")
		this.pause()
		this.downloadFromExisting()
	}

	this.handleProgress = () => {
		this.calculateStats()
		if(this.stats.present.deltaDownloaded == 0) {
			this.timesZero++
			if(this.timesZero == 50) {
				this.pause()
				this.restartInterval = setInterval(() => {
					this.downloadFromExisting()
				}, 5000)
				return false
			}
		} else {
			this.timesZero = 0
			if(this.restartInterval) clearInterval(this.restartInterval)
		}
		this.emit('progress', this.stats)
		if(this.stats.total.completed == 100) {
			if(this.progressSubscription) {
				this.progressSubscription.dispose()
			}
			this.handleFinishDownload()
		}
	}

	//region STATS CALCULATION FUNCTIONS
	this.setMeta = meta => {
		let { range, totalBytes, threads, offsets } = meta
		this.meta = { range, totalBytes, threads, offsets }
	}

	this.calculateInitialStats = data => {
		let { range, totalBytes, threads, offsets } = data
		this.meta = { range, totalBytes, threads, offsets }
		this.calculateStartTime()
		this.calculatePastDownloaded()
		this.calculateTotalSize()
	}

	this.calculateStats = () => {
		this.calculateTotalDownloaded()
		this.calculateTotalCompleted()
		this.calculatePresentDownloaded()
		this.calculatePresentTime()
		this.calculateSpeeds()
		this.calculateFutureRemaining()
		this.calculateFutureEta()
	}

	this.handleFinishDownload = () => {
		this.calculateTotalDownloaded()
		this.calculateTotalCompleted()
		this.calculatePresentDownloaded()
		this.calculateEndTime()
		this.calculateSpeeds()
		this.calculateFutureRemaining()
		this.calculateFutureEta()
		fs.rename(this.options.mtdpath, this.options.path, () => { 
			clearInterval(this.updateInterval)
			this.emit('finish', this.stats)
			})       
	}

	this.calculateDownloaded = () => {
		let { threads, offsets } = this.meta

		if(!threads) { return 0 }

		let downloaded = 0
		threads.forEach((thread, idx) => {
			downloaded += offsets[idx] - thread[0]
		})

		return downloaded
	}

	this.calculateStartTime = () => {
		if(!this.stats.time.start) {
			this.stats.time.start = Math.floor(Date.now())
		}
	}

	this.calculateEndTime = () => {
		this.stats.time.end = Math.floor(Date.now())
	}

	this.calculatePastDownloaded = () => {
		this.stats.past.downloaded = this.calculateDownloaded()
	}

	this.calculateTotalSize = () => {
		this.stats.total.size = this.meta.totalBytes
	}
	
	this.calculateTotalDownloaded = () => {
		if(!this.stats.total.downloaded) {
			this.stats.present.deltaDownloaded = this.stats.past.downloaded
		} else {
			this.stats.present.deltaDownloaded = this.stats.total.downloaded
		}
		this.stats.total.downloaded = this.calculateDownloaded()
		this.stats.present.deltaDownloaded = this.stats.total.downloaded - this.stats.present.deltaDownloaded
	}

	this.calculateTotalCompleted = () => {
		let { downloaded, size } = this.stats.total
		this.stats.total.completed = 100*downloaded / size
	}

	this.calculatePresentDownloaded = () => {
		this.stats.present.downloaded = this.stats.total.downloaded - this.stats.past.downloaded
	}

	this.calculatePresentTime = () => {
		this.stats.present.time += this.options.throttleRate
	}

	this.calculateSpeeds = () => {
		this.stats.present.averageSpeed = 1000*this.stats.present.downloaded / this.stats.present.time
		this.stats.present.speed = this.stats.present.averageSpeed
	}

	this.calculateFutureRemaining = () => {
		this.stats.future.remaining = this.stats.total.size - this.stats.total.downloaded
	}

	this.calculateFutureEta = () => {
		this.stats.future.eta = this.stats.future.remaining / this.stats.present.averageSpeed
	}
	//endregion

	this.handleError = err => {
		this.emit('error', err)
		if(this.retried < this.options.retry) {
			this.restart()
			this.retried++
		} else {
			this.pause()
		}
	}
}

module.exports = suDownloadItem