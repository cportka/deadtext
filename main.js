const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const dialogModule = require('./dialog');  // our module for dialog actions

// Keep track of open windows (for offset positioning on new windows)
let windows = [];

function createWindow() {
  const lastWindow = windows[windows.length - 1];
  // Offset new window a bit if one already open
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    x: lastWindow ? lastWindow.getPosition()[0] + 20 : undefined,
    y: lastWindow ? lastWindow.getPosition()[1] + 20 : undefined,
    webPreferences: {
      nodeIntegration: true,
      // enableRemoteModule: true,  // NOT using remote, so not needed
    }
  });

  // Load the main HTML file
  win.loadFile(path.join(__dirname, 'src', 'index.html'));

  windows.push(win);
  win.on('closed', () => {
    // Remove from window list on close
    windows.splice(windows.indexOf(win), 1);
  });
}

// Set up application menus with standard items and our file actions
app.whenReady().then(() => {
  createWindow();

  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'New', click: () => createWindow() },                     // Open a new editor window
        { label: 'Open', click: () => dialogModule.openFile(BrowserWindow.getFocusedWindow()) },
        { label: 'Save', click: () => dialogModule.saveFile(BrowserWindow.getFocusedWindow()) },
        { label: 'Save As', click: () => dialogModule.saveFileAs(BrowserWindow.getFocusedWindow()) },
        { label: 'Close', click: () => dialogModule.closeWindow(BrowserWindow.getFocusedWindow()) },
        // On Windows/Linux, this will appear as "Exit". On macOS, it's handled in the app menu as "Quit <AppName>"
        { role: 'quit' }  
      ]
    },
    {
      label: 'Edit',
      submenu: [ { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
                 { role: 'cut' }, { role: 'copy' }, { role: 'paste' } ]
    },
    {
      label: 'View',
      submenu: [ { role: 'reload' }, { role: 'toggledevtools' }, { type: 'separator' },
                 { role: 'resetzoom' }, { role: 'zoomin' }, { role: 'zoomout' }, 
                 { type: 'separator' }, { role: 'togglefullscreen' } ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About', click: () => dialogModule.showAbout() }
        // (Settings removed for minimalism)
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Windows/Linux: quit app when all windows are closed. On macOS, leave app running.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
  // macOS: recreate a window when dock icon is clicked and no windows open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// IPC event handlers for save operations (from renderer)
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
