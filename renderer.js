const { ipcRenderer, dialog, remote } = require('electron')
const fs = require('fs');
let filePath = null

window.onload = function() {
    document.querySelector('#text-editor').addEventListener('keydown', function(e) {
        if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            ipcRenderer.send('save-file');
        }
    });
}

ipcRenderer.on('new-file', () => {
  document.getElementById('text-editor').value = ''
  filePath = null
})

ipcRenderer.on('load-file', (event, path) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) return console.error('Could not open file: ' + err)
    document.getElementById('text-editor').value = data
    filePath = path
  })
})

ipcRenderer.on('save-file', () => {
  if (filePath) {
    let content = document.getElementById('text-editor').value
    fs.writeFile(filePath, content, (err) => {
      if (err) console.error('Error saving file: ' + err)
    })
  } else {
    ipcRenderer.send('save-file-as')
  }
})

ipcRenderer.on('save-file-as', () => {
  remote.dialog.showSaveDialog((fileName) => {
    if (fileName === undefined) return
    let content = document.getElementById('text-editor').value
    fs.writeFile(fileName, content, (err) => {
      if (err) console.error('Error saving file: ' + err)
    })
    filePath = fileName
  })
})
