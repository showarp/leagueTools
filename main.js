const {
    app,
    ipcMain,
    BrowserWindow,
    Menu,
    Tray,
} = require('electron');
const cp = require('child_process');
const iconv = require('iconv-lite');
const fs = require('fs');
const Store = require('electron-store');
Store.initRenderer();  //如果要在渲染进程里使用electron-store 就必须在主进程里面调用
var mainWindow = null; //声明要打开的主窗口
let tray = null;
app.on('ready', () => {
    let winsize = require('electron').screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: 300,
        height: winsize.height,
        x: winsize.width - 300,
        y: 0,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        },
        show: false, //加载完页面在显示窗口（开启软件时不会有白屏）
        frame: false, //隐藏 关闭 最小化 最大化 按钮
        resizable: false //禁止缩放
    });
    mainWindow.setSkipTaskbar(true);
    ipcMain.on('window-close', () => { //监听渲染进程发来的事件
        mainWindow.close();
    });
    ipcMain.on('window-hidden', () => {
        mainWindow.hide();
        mainWindow.setSkipTaskbar(true);
    });
    //点击startgame 开始的函数
    ipcMain.on('gameST', (event,gamePath) => {
        cp.exec(gamePath,(error, stdout, stderr)=>{
            //假设游戏路径原则上是正确的 但是实际上却没有这个路径  这个问题该如何解决
        });
    });
    mainWindow.setMenu(null); //隐藏工具栏
    mainWindow.loadFile('./main/index.html'); //加载那个页面
    mainWindow.openDevTools(); //打开f12
    mainWindow.setAlwaysOnTop(true); //置顶
    tray = new Tray('./main/img/icon/close.png');
    const contextMenu = Menu.buildFromTemplate([{
            label: '🛫'
        },
        {
            label: '🛫'
        },
        {
            label: '🛫'
        },
        {
            label: '退出',
            click: function () {
                mainWindow.close();
            }
        }
    ]);
    tray.setToolTip('对不起，从现在开始我要   起 飞🛫');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        mainWindow.webContents.send('showWin'); //发送事件给渲染进程
        mainWindow.show();
        // mainWindow.setSkipTaskbar(false);
    });
    mainWindow.on('closed', () => { //监听关闭事件，把主窗口设置为null
        mainWindow = null;
    });
    mainWindow.on('ready-to-show', () => { //加载完页面在显示窗口（开启软件时不会有白屏）
        mainWindow.show();
    });

});