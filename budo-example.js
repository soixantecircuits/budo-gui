'use strict'

const budo = require('budo')

budo('', {
  live: true, // setup live reload
  dir: '/Users/gabrielstuff/Desktop/test'
}).on('connect', function (ev) {
  console.log('Server running on %s', ev.uri)
  console.log('LiveReload running on port %s', ev.livePort)
}).on('update', function (buffer) {
  console.log('bundle - %d bytes', buffer.length)
})
