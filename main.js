const { app, BrowserWindow } = require('electron');

let mainWindow;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
      width: 1000,
      height: 600
    })

    mainWindow.webContents.openDevTools();

    mainWindow.setMenu(null)
  
    mainWindow.loadFile('index.html');

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

});
