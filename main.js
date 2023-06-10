const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const dialog = require('./dialog');

let windows = []

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    x: windows.length ? windows[windows.length - 1].getPosition()[0] + 20 : undefined,
    y: windows.length ? windows[windows.length - 1].getPosition()[1] + 20 : undefined,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/index.html')

  windows.push(win);

  win.on('closed', () => {
    windows.splice(windows.indexOf(win), 1);
  })
}

app.on('ready', () => {
  createWindow()

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New', click: () => createWindow() },
        { label: 'Open', click: () => dialog.openFile(BrowserWindow.getFocusedWindow()) },
        { label: 'Save', click: () => dialog.saveFile(BrowserWindow.getFocusedWindow()) },
        { label: 'Save As', click: () => dialog.saveFileAs(BrowserWindow.getFocusedWindow()) },
        { label: 'Close', click: () => dialog.closeWindow(BrowserWindow.getFocusedWindow()) },
        { label: 'Exit', click: () => dialog.quitApp(app) }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About', click: () => dialog.showAbout() },
        { label: 'Settings', click: () => dialog.showSettings() }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
})
