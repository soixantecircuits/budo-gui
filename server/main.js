module.exports = {
  init: function(app, window) {
    let port = 8080
    console.log('Launch server')
    const ipcMain = require('electron').ipcMain
    const budo = require('budo')
    const babelify = require('babelify')

    ipcMain.on('start-server', function(event, path) {
      console.log(path);
      console.log('running budo...')
      budo('', {
        live: true, // setup live reload
        dir: path
      }).on('connect', function(ev) {
        console.log('Server running on %s', ev.uri)
        console.log('LiveReload running on port %s', ev.livePort)
        window.webContents.send('server-started', {url: ev.uri, name: path, checked:true})
      }).on('update', function(buffer) {
        console.log('bundle - %d bytes', buffer.length)
      })
      port++
    })
  }
}
