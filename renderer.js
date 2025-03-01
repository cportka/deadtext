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
ipcRenderer.on('save-file-as', (event, newPath) => {
  if (!newPath) return;  // If no path provided (dialog canceled), do nothing
  const content = document.getElementById('text-editor').value;
  fs.writeFile(newPath, content, (err) => {
    if (err) {
      return console.error('Error saving file:', err);
    }
    filePath = newPath;  // Update current file path to the new saved file
  });
});
