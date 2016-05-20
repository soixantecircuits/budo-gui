module.exports = (function home() {
  'use strict'
  const Vue = require('vue')
  const VueMdl = require('vue-mdl')
  const _ = require('lodash')
  const shell = require('electron').shell
  const dragDrop = require('drag-drop')
  Vue.use(VueMdl.default)

  let ctrl = {}
  ctrl.init = function init() {
    console.log('home.js - init home controller.')
    var shell = require('electron').shell;
    //open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault()
        if($(this).data('open')){
          shell.openExternal(this.href)
        }
    })
    var dropTarget = document.querySelector("body")
    const ipcRenderer = require('electron').ipcRenderer
    dragDrop('body', {
      onDrop: function(files, pos, directories){
        console.log(directories)
        console.log("Got some files:", directories[0].file.path)
        ctrl.vServer.inprogress = true
        ipcRenderer.send('start-server', directories[0].file.path)
      },
      onDragOver: function () {
        $('#dropTarget').css({backgroundColor:'rgba(63, 81, 181, 0.45)'})
      },
      onDragLeave: function () {
        $('#dropTarget').css({backgroundColor:'rgba(63, 81, 181, 0)'})
      }
    })

    ctrl.vServer = new Vue({
      el: '#home',
      data: {
        servers: [],
        inprogress:false
      }
    })

    ipcRenderer.on('server-started', function(event, serverInstance) {
      ctrl.addServer(serverInstance)
      ctrl.vServer.inprogress = false
    })
    ipcRenderer.on('server-stopped', function(event, serverInstance) {
      ctrl.removeServer(serverInstance)
    })
  }

  ctrl.addServer = function addServer(server) {
    let servers = ctrl.vServer.$get('servers')
    servers.push(server)
    ctrl.vServer.$set('servers', servers)
  }

  ctrl.removeServer = function removeServer(server) {
    ctrl.vServer.$set('servers', _.remove(ctrl.vServer.$get('servers'), server))
  }

  ctrl.destroy = function destroy() {}

  return ctrl
})()
