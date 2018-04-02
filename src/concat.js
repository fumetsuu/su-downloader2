const fs = require('fs')

module.exports = function concat(files, outputFile) {
	return new Promise((resolve, reject) => {
		var filereadPromises = files.map(file => fsReadFile(file))
		Promise.all(filereadPromises).then(fileDatas => {
			var fileappendPromise = fileDatas.map(fileData => fsAppendFile(outputFile, fileData))
			Promise.all(fileappendPromise).then(() => {
				return resolve(outputFile)
			}).catch(err => { if(err) return reject(err) })
		}).catch(err => { if(err) return reject(err) })
	})
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
			return resolve(true)
		})
	})
}