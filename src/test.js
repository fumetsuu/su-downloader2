const suDownloadItem = require('./suDownloadItem')

const hey = new suDownloadItem({ url: 'https://imagejournal.org/wp-content/uploads/bb-plugin/cache/23466317216_b99485ba14_o-panorama.jpg', path: './downloads/test.jpg'})

hey.start()

hey.on('progress', console.log)