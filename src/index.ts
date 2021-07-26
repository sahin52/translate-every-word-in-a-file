import {
  app,
  BrowserWindow,
  dialog
} from 'electron';
import * as path from 'path';
import {
  ipcMain
} from "electron";
import * as os from "os";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    console.log("demene");
    ipcMain.on('open-file-dialog-for-file', (event) => {
      console.log("slm");
        if (os.platform() === 'linux' || os.platform() === 'win32') {
          dialog.showOpenDialog({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            properties: ['openFile']
          }, function (files: any[]) {
            if (files) event.sender.send('selected-file', files[0]);
          });
        } else {
          dialog.showOpenDialog({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            properties: ['openFile', 'openDirectory']
          }, function (files: any[]) {
            if (files) event.sender.send('selected-file', files[0]);
          });
        }
      });
    };

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

    ipcMain.on('close-main-window', () => {
      app.quit();
    })

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and import them here.