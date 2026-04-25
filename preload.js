const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('dt', {
  openFile: () => ipcRenderer.invoke('dt:open'),
  openPath: (p) => ipcRenderer.invoke('dt:open-path', p),
  saveFile: (content) => ipcRenderer.invoke('dt:save', content),
  saveFileAs: (content) => ipcRenderer.invoke('dt:save-as', content),

  setDirty: (dirty) => ipcRenderer.send('dt:dirty', !!dirty),
  confirmClose: () => ipcRenderer.send('dt:confirm-close'),

  pathForFile: (file) => {
    try { return webUtils.getPathForFile(file); } catch { return null; }
  },

  onLoad: (cb) => {
    ipcRenderer.on('dt:load', (_e, payload) => cb(payload));
  },
  onMenuSave: (cb) => {
    ipcRenderer.on('dt:menu:save', () => cb());
  },
  onMenuSaveAs: (cb) => {
    ipcRenderer.on('dt:menu:save-as', () => cb());
  },
  onSaveAndClose: (cb) => {
    ipcRenderer.on('dt:save-and-close', () => cb());
  }
});
