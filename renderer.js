const fs = require('fs');
const {dialog} = require('electron').remote;

window.onload = function() {
    document.querySelector('#text-editor').addEventListener('keydown', function(e) {
        if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            saveFile();
        }
    });
}

function saveFile() {
    let content = document.querySelector('#text-editor').value;
    dialog.showSaveDialog((fileName) => {
        if (fileName === undefined) return;
        fs.writeFile(fileName, content, (err) => {
            if (err) console.log('error saving file: ' + err);
        });
    });
}
