const concat = require('./concat')

concat(['./downloads/test.txt.PARTIAL0', './downloads/test.txt.PARTIAL1'], './downloads/heyyy.txt')
	.then(() => console.log('done rebuilding'))
	.catch(err => console.log('error:', err))