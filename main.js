/* main.js
   Highlights:
   - Set app.name = 'DeadText' before creating menu (particularly for macOS).
   - Return or handle the promise from app.whenReady() to avoid ESLint 'catch-or-return' warnings.
   - Provide a consistent window title (DeadText) and loadFile from 'src/index.html'.
*/

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const dialogModule = require('./dialog');

let windows = [];

function createWindow() {
  const lastWindow = windows[windows.length - 1];
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'DeadText',
    x: lastWindow ? lastWindow.getPosition()[0] + 25 : undefined,
    y: lastWindow ? lastWindow.getPosition()[1] + 25 : undefined,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  windows.push(win);

  win.on('closed', () => {
    windows = windows.filter(w => w !== win);
  });
}

app.name = 'DeadText'; // sets the name used in macOS menu bar
app.whenReady().then(() => {
  createWindow();

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New', click: () => createWindow() },
        { label: 'Open', click: () => dialogModule.openFile(BrowserWindow.getFocusedWindow()) },
        { label: 'Save', click: () => dialogModule.saveFile(BrowserWindow.getFocusedWindow()) },
        { label: 'Save As', click: () => dialogModule.saveFileAs(BrowserWindow.getFocusedWindow()) },
        { label: 'Close', click: () => dialogModule.closeWindow(BrowserWindow.getFocusedWindow()) },
        { role: 'quit' }
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
        { label: 'About DeadText', click: () => dialogModule.showAbout() }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // standard OS-specific close behavior
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  return null; // returning a value to satisfy always-return rule
}).catch(err => {
  // optional catch for app.whenReady() promise
  console.error('Error during app initialization:', err);
});

// IPC hooks (renderer to main)
ipcMain.on('save-file', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  dialogModule.saveFile(win);
});

ipcMain.on('save-file-as', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  dialogModule.saveFileAs(win);
});

ipcMain.on('open-file', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  dialogModule.openFile(win);
});

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  dialogModule.closeWindow(win);
});
