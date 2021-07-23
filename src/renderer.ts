import electron = require("electron");


const button = document.getElementById("upload");

button.addEventListener('click',(event)=>{
    electron.ipcRenderer.send('open-file-dialog-for-file');
});
electron.ipcRenderer.on('selected-file',(event,path)=>{
    console.log("deneme");
    console.log('path is: '+path);
})