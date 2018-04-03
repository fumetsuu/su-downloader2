const concat = require('./concat')

concat(['./downloads/a.txt', './downloads/b.txt'], './downloads/ab.txt', true, true)
	.then(() => console.log('done rebuilding'))
	.catch(err => console.log('error:', err))