const concat = require('./concat')

concat(['./downloads/a.txt', './downloads/b.txt', './downloads/c.txt'], './downloads/CONCAT.txt')
	.then(() => console.log('done rebuilding'))
	.catch(err => console.log('error:', err))