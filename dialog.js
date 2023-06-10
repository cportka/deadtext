const { dialog, BrowserWindow, app } = require('electron');
const settings = require('electron-settings');
const path = require('path');
const fs = require('fs');

module.exports = {
  showAbout: () => {
    const win = BrowserWindow.getFocusedWindow();
    const readmePath = path.join(__dirname, 'README.md');
    let readmeContent = "README not found.";
    if(fs.existsSync(readmePath)){
      readmeContent = fs.readFileSync(readmePath, 'utf-8');
    }
    dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['Ok'],
      title: 'About',
      message: readmeContent
    });
  },

  showSettings: () => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile('settings.html');
  },

  openFile: (win) => {
    dialog.showOpenDialog(win, {
      defaultPath: settings.get('defaultOpenPath', path.resolve(app.getPath('home'), 'Desktop')),
      properties: ['openFile']
    }).then(result => {
      if (!result.canceled && result.filePaths.length > 0) {
        win.webContents.send('load-file', result.filePaths[0]);
        settings.set('defaultOpenPath', path.dirname(result.filePaths[0]));
      }
    });
  },

  saveFile: (win) => {
    win.webContents.send('save-file');
  },

  saveFileAs: (win) => {
    dialog.showSaveDialog(win, {
      defaultPath: settings.get('defaultSavePath', path.resolve(app.getPath('home'), 'Desktop', 'Untitled.txt'))
    }).then(result => {
      if (!result.canceled && result.filePath) {
        win.webContents.send('save-file-as', result.filePath);
        settings.set('defaultSavePath', path.dirname(result.filePath));
      }
    });
  },

  closeWindow: (win) => {
    win.close();
  },

  quitApp: (app) => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('quit-app');
    });
  }
};
