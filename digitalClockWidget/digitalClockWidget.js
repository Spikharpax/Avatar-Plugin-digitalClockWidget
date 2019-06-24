const {remote, ipcRenderer} = require('electron');
const {ipcMain, BrowserWindow} = remote;
const fs = require('fs-extra');

let timeWidget;

exports.addPluginElements = function(CY){
  if (timeWidget) {
    timeWidget.show();
    return;
  }

  let id = ipcRenderer.sendSync('info', 'id');
  let win = BrowserWindow.fromId(id);
  let style = {
    parent: win,
    frame: false,
    width: 148,
    height: 25,
    movable: true,
    resizable: false,
    show: false,
    title: 'Widget Time'
  }
  if (fs.existsSync('./resources/core/plugins/digitalClockWidget/style.json')) {
    let prop = fs.readJsonSync('./resources/core/plugins/digitalClockWidget/style.json', { throws: false });
    if (prop) {
        style.x = prop.x;
        style.y = prop.y;
    }
  }

  timeWidget = new BrowserWindow(style);
  timeWidget.loadFile('../core/plugins/digitalClockWidget/html/timeWidget.html');
  ipcRenderer.sendSync('addPluginWindowID', timeWidget.id);

  timeWidget.once('ready-to-show', () => {
      timeWidget.show();
  });

  timeWidget.on('closed', function () {
    timeWidget = null;
  });

}


exports.onAvatarClose = function(callback){

  if (timeWidget) {
    let pos = timeWidget.getPosition();
    fs.writeJsonSync('./resources/core/plugins/digitalClockWidget/style.json', {
      x: pos[0],
      y: pos[1]
    });
  }
  callback();

}


exports.action = function(data, next){

  next();

}
