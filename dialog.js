/* dialog.js
   Highlights:
   - Return the promises in openFile/saveFileAs to satisfy ESLint's 'always-return' rule.
   - Use dialog.showErrorBox for errors instead of console.error, satisfying no-console rule.
   - Use getSync/setSync from 'electron-settings' if version 4+ (or ensure usage is consistent).
*/

const { dialog, app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const settings = require('electron-settings');

module.exports = {
  showAbout() {
    const win = BrowserWindow.getFocusedWindow();
    let aboutMessage = 'DeadText: A minimal text editor.\n(c) 2025 Chris Portka';
    // optionally read an external README file if present
    const readmePath = path.join(__dirname, 'README.md');
    if (fs.existsSync(readmePath)) {
      aboutMessage = fs.readFileSync(readmePath, 'utf-8');
    }
    dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['OK'],
      title: 'About DeadText',
      message: aboutMessage
    });
  },

  openFile(win) {
    const defaultDir = settings.getSync('defaultOpenPath') || app.getPath('desktop');
    return dialog.showOpenDialog(win, {
      defaultPath: defaultDir,
      properties: ['openFile']
    }).then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const file = result.filePaths[0];
        // send path to renderer to load
        win.webContents.send('load-file', file);
        settings.setSync('defaultOpenPath', path.dirname(file));
      }
      // returning null or undefined to satisfy always-return rule
      return null;
    }).catch((err) => {
      dialog.showErrorBox('Error Opening File', `Failed to open file:\n${err.message}`);
      throw err; // re-throw if you want top-level handling or logging
    });
  },

  saveFile(win) {
    // Instruct renderer to do a 'save-file' (which checks if path is known)
    win.webContents.send('save-file');
  },

  saveFileAs(win) {
    const defaultFile = settings.getSync('defaultSavePath') ||
      path.join(app.getPath('desktop'), 'Untitled.txt');
    return dialog.showSaveDialog(win, {
      defaultPath: defaultFile
    }).then((result) => {
      if (!result.canceled && result.filePath) {
        // send the chosen path to renderer
        win.webContents.send('save-file-as', result.filePath);
        settings.setSync('defaultSavePath', path.dirname(result.filePath));
      }
      return null;
    }).catch((err) => {
      dialog.showErrorBox('Error Saving File', `Failed to save file:\n${err.message}`);
      throw err;
    });
  },

  closeWindow(win) {
    if (win) win.close();
  }
};
