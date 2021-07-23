"use strict";
exports.__esModule = true;
var electron = require("electron");
var button = document.getElementById("upload");
button.addEventListener('click', function (event) {
    electron.ipcRenderer.send('open-file-dialog-for-file');
});
electron.ipcRenderer.on('selected-file', function (event, path) {
    console.log("deneme");
    console.log('path is: ' + path);
});
//# sourceMappingURL=renderer.js.map