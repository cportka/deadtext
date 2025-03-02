const fs = require('fs');
const path = require('path');

const { dialog, BrowserWindow, app } = require('electron');
const settings = require('electron-settings');

module.exports = {
  showAbout: () => {
    const win = BrowserWindow.getFocusedWindow();
    // Read README.md content to display (falls back if not found)
    const readmePath = path.join(__dirname, 'README.md');
    let readmeContent = 'DeadText – a minimalist text editor.\n(c) 2023 Chris Portka';
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf-8');
    }
    dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['OK'],
      title: 'About DeadText',
      message: readmeContent
    });
  },

  openFile: (win) => {
    // Default to last used open path or the desktop directory
    const defaultDir = settings.getSync('defaultOpenPath') || app.getPath('desktop');
    dialog.showOpenDialog(win, {
      defaultPath: defaultDir, // ensure this is a string
      properties: ['openFile']
    }).then(result => {
      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        // Send the file path to renderer to load contents
        win.webContents.send('load-file', filePath);
        // Remember the directory for next time
        settings.setSync('defaultOpenPath', path.dirname(filePath));
      }
    }).catch(err => {
      console.error('Error opening file:', err);
    });
  },

  saveFile: (win) => {
    // Instruct renderer to save. If it has no file path, the renderer will request Save As.
    win.webContents.send('save-file');
  },

  saveFileAs: (win) => {
    // Default to last used save directory or desktop with default filename
    const defaultPath = settings.getSync('defaultSavePath') ||
                        path.join(app.getPath('desktop'), 'untitled.txt');
    dialog.showSaveDialog(win, {
      defaultPath // ensure this is a string
    }).then(result => {
      if (!result.canceled && result.filePath) {
        const filePath = result.filePath;
        // Send the chosen path to renderer to perform the file write
        win.webContents.send('save-file-as', filePath);
        // Remember the directory for next time
        settings.setSync('defaultSavePath', path.dirname(filePath));
      }
    }).catch(err => {
      console.error('Error saving file:', err);
    });
  },

  closeWindow: (win) => {
    if (win) win.close();
  }
};
