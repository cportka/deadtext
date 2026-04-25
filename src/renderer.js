(() => {
  const editor = document.getElementById('text-editor');
  let savedSnapshot = '';
  let dirty = false;

  function setDirty(next) {
    if (next === dirty) return;
    dirty = next;
    window.dt.setDirty(dirty);
  }

  function recomputeDirty() {
    setDirty(editor.value !== savedSnapshot);
  }

  async function doSave() {
    const result = await window.dt.saveFile(editor.value);
    if (result && result.ok) {
      savedSnapshot = editor.value;
      setDirty(false);
    }
    return result;
  }

  async function doSaveAs() {
    const result = await window.dt.saveFileAs(editor.value);
    if (result && result.ok) {
      savedSnapshot = editor.value;
      setDirty(false);
    }
    return result;
  }

  editor.addEventListener('input', recomputeDirty);

  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.setRangeText('\t', start, end, 'end');
      recomputeDirty();
      return;
    }
    const mod = e.metaKey || e.ctrlKey;
    if (mod && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      if (e.shiftKey) doSaveAs(); else doSave();
    }
  });

  window.dt.onLoad(({ content }) => {
    editor.value = content ?? '';
    savedSnapshot = editor.value;
    setDirty(false);
    editor.focus();
  });

  window.dt.onMenuSave(doSave);
  window.dt.onMenuSaveAs(doSaveAs);

  window.dt.onSaveAndClose(async () => {
    const result = await doSave();
    if (result && result.ok) window.dt.confirmClose();
  });

  window.addEventListener('dragover', (e) => { e.preventDefault(); });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    const p = window.dt.pathForFile(file);
    if (p) window.dt.openPath(p);
  });

  editor.focus();
})();
