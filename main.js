const {app, autoUpdater, BrowserWindow, webFrame, Menu, dialog} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const server = 'https://electron-update-server.herokuapp.com'
const feed = `${server}/update/rickycodes/Dotgrid/${process.platform}/${app.getVersion()}`

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

let is_shown = true;

app.inspect = function()
{
  app.win.toggleDevTools();
}

app.toggle_fullscreen = function()
{
  app.win.setFullScreen(app.win.isFullScreen() ? false : true);
}

app.toggle_visible = function()
{
  if(is_shown){ app.win.hide(); } else{ app.win.show(); }
}

app.inject_menu = function(m)
{
  Menu.setApplicationMenu(Menu.buildFromTemplate(m));
}

app.win = null;

app.on('ready', () => 
{
  app.win = new BrowserWindow({width: 400, height: 420, minWidth: 400, minHeight: 420, backgroundColor:"#000", frame:false, autoHideMenuBar: true, icon: __dirname + '/icon.ico'})

  app.win.loadURL(`file://${__dirname}/sources/index.html`);
  
  app.win.on('closed', () => {
    win = null
    app.quit()
  })

  app.win.on('hide',function() {
    is_shown = false;
  })

  app.win.on('show',function() {
    is_shown = true;
  })

  // we'll only want to do this in the packaged app!
  if (!process.env.DEV) {
    const oneMinute = 60000;
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, oneMinute);
  }
})

app.on('window-all-closed', () => 
{
  app.quit()
})

app.on('activate', () => {
  if (app.win === null) {
    createWindow()
  }
  else{
    
  }
})
