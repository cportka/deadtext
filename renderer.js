const { ipcRenderer } = require('electron');
const fs = require('fs');

let filePath = null;  // Tracks the current file path (if saved/opened)

window.onload = () => {
  const textArea = document.getElementById('text-editor');
  // Intercept Ctrl+S / Cmd+S for save
  textArea.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.includes('Mac');
    if ((isMac ? e.metaKey : e.ctrlKey) && e.keyCode === 83) {  // Cmd/Ctrl + S
      e.preventDefault();
      ipcRenderer.send('save-file');
    }
    // (Optional: you could add other shortcuts like Ctrl+O, Ctrl+N, Ctrl+W similarly)
  });
};

// Load file content when main process provides a file path
ipcRenderer.on('load-file', (event, path) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      return console.error('Could not open file:', err);
    }
    document.getElementById('text-editor').value = data;
    filePath = path;
  });
});

// Save current content to disk (for "Save" action)
ipcRenderer.on('save-file', () => {
  if (filePath) {
    // Write to existing file
    const content = document.getElementById('text-editor').value;
    fs.writeFile(filePath, content, (err) => {
      if (err) console.error('Error saving file:', err);
    });
  } else {
    // No file yet – trigger a Save As flow in main
    ipcRenderer.send('save-file-as');
  }
});

// Save content to a new file (for "Save As" action)
ipcRenderer.on('save-file-as', (event, targetPath) => {
  if (!targetPath) return;  // dialog was canceled or no path provided
  let content = document.getElementById('text-editor').value;
  fs.writeFile(targetPath, content, (err) => {
      if (err) {
          console.error('Error saving file: ' + err);
      }
  });
  filePath = targetPath; // Update current file path to the new saved file
});

document.querySelector('#text-editor').addEventListener('keydown', function(e) {
  if (e.key === 'Tab' || e.keyCode === 9) {  
      e.preventDefault();
      const textEditor = document.getElementById('text-editor');
      // Insert a tab at the current selection/cursor
      textEditor.setRangeText('\t', textEditor.selectionStart, textEditor.selectionEnd, 'end');
      return;  // exit, so we don’t fall through to other shortcuts
  }
  if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      ipcRenderer.send('save-file');
  }
});
