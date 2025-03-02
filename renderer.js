/* renderer.js
   Highlights:
   - Single 'keydown' event listener handles Tab insertion and Ctrl/Cmd+S.
   - Save logic listens for 'save-file' and 'save-file-as' events from main.
   - Alerts or notifies user on error instead of console.log.
*/

const { ipcRenderer } = require('electron');
const fs = require('fs');

let filePath = null;

window.onload = () => {
  const textEditor = document.getElementById('text-editor');

  textEditor.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.includes('Mac');

    // Insert '\t' on Tab key press
    if (e.key === 'Tab' || e.keyCode === 9) {
      e.preventDefault();
      // Insert a tab at current cursor position
      textEditor.setRangeText('\t',
        textEditor.selectionStart,
        textEditor.selectionEnd,
        'end'
      );
      return;
    }

    // Ctrl+S / Cmd+S for save
    if ((isMac ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {
      e.preventDefault();
      ipcRenderer.send('save-file');
    }
  });
};

/** Load file content upon openFile request */
ipcRenderer.on('load-file', (event, path) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      alert(`Could not open file:\n${err.message}`);
      return;
    }
    document.getElementById('text-editor').value = data;
    filePath = path;
  });
});

/** 'save-file': Save to current path if it exists, otherwise trigger 'save-file-as'. */
ipcRenderer.on('save-file', () => {
  if (!filePath) {
    // no existing path => must do Save As
    ipcRenderer.send('save-file-as');
    return;
  }
  const content = document.getElementById('text-editor').value;
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      alert(`Error saving file:\n${err.message}`);
      return;
    }
    // file saved successfully - could show success notification if needed
  });
});

/** 'save-file-as': Main provides a chosen path; we write to that file and track it. */
ipcRenderer.on('save-file-as', (event, chosenPath) => {
  if (!chosenPath) {
    // user canceled
    return;
  }
  const content = document.getElementById('text-editor').value;
  fs.writeFile(chosenPath, content, (err) => {
    if (err) {
      alert(`Error saving file:\n${err.message}`);
      return;
    }
    filePath = chosenPath;
  });
});
