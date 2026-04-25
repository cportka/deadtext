// Electron platform: thin wrapper around window.dt exposed by preload.js.
// Title and dirty indicator are managed by main.js, so setName/setDirty
// flow through IPC.

const dt = typeof window !== 'undefined' ? window.dt : null;

const electron = {
  name: 'electron',

  async openFile() {
    return dt.openFile();
  },

  async saveFile(content) {
    return dt.saveFile(content);
  },

  async saveFileAs(content) {
    return dt.saveFileAs(content);
  },

  async openDroppedFile(file) {
    const p = dt.pathForFile(file);
    if (!p) return { ok: false, error: 'Could not resolve file path' };
    return dt.openPath(p);
  },

  setDirty(dirty) {
    dt.setDirty(!!dirty);
  },

  setName(_name) {
    // Electron computes the title from main.js based on the file path; nothing
    // to do here. setDirty flips the bullet in the title.
  },

  onLoad(cb) { dt.onLoad(cb); },
  onMenuSave(cb) { dt.onMenuSave(cb); },
  onMenuSaveAs(cb) { dt.onMenuSaveAs(cb); },
  onSaveAndClose(cb) { dt.onSaveAndClose(cb); },
  confirmClose() { dt.confirmClose(); }
};

export default electron;
