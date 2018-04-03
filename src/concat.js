const fs = require('fs')
const PQueue = require('p-queue')
const pqueue = new PQueue({ concurrency: 1 })

module.exports = function concat(files, outputFile, removeFiles, removeOutputFileIfExists) {
	if(!removeOutputFileIfExists) {
		return new Promise((resolve, reject) => {
			var filereadPromises = files.map(fsReadFile)
			Promise.all(filereadPromises).then(fileDatas => {
				var fileappendPromise = fileDatas.map(fileData => () => fsAppendFile(outputFile, fileData))
				pqueue.addAll(fileappendPromise).then(() => {
					if(removeFiles) {
						var fileremovePromise = files.map(fsUnlink)
						Promise.all(fileremovePromise).then(() => {
							return resolve(outputFile)
						}).catch(err => { if(err) return reject(err) })
					} else {
						return resolve(outputFile)
					}
				}).catch(err => { if(err) return reject(err) })
			}).catch(err => { if(err) return reject(err) })
		})
	} else {
		return new Promise((resolve, reject) => {
			if(fs.existsSync(outputFile)) {
				fsUnlink(outputFile).then(() => {
					return resolve(concat(files, outputFile, removeFiles, false))
				}).catch(err => { if(err) return reject(err) })
			} else {
				return resolve(concat(files, outputFile, removeFiles, false))
			}
		})
	}
}

function fsReadFile(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if(err) return reject(err)
			return resolve(data)
		})
	})
}

function fsAppendFile(file, data) {
	return new Promise((resolve, reject) => {
		fs.appendFile(file, data, (err) => {
			if(err) return reject(err)
			return resolve(file)
		})
	})
}

function fsUnlink(file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, err => {
			if(err) return reject(err)
			return resolve(true)
		})
	})
}