const electron = require('electron');
const request = require('request');
const ipc = electron.ipcRenderer;
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();
window.addEventListener('load', () => {
    let img = document.querySelectorAll('img'); //取消图片默认事件
    img.forEach(function (a) {
        a.onmousedown = function (e) {
            e.preventDefault();
        };
    });
    windowClose = document.querySelector('#win-close');
    windowHidden = document.querySelector('#win-hidden');
    main = document.querySelector('#main');

    function ipchidden() {
        ipc.send('window-hidden');
        this.removeEventListener('transitionend', ipchidden);
    }
    windowClose.addEventListener('click', () => {
        ipc.send('window-close');

    });
    main.style.top = '100%'
    windowHidden.addEventListener('click', () => {
        main.style.top = '100%';
        main.addEventListener('transitionend', ipchidden);
    });
    ipc.on('showWin', (a, b) => {
        main.style.top = '0px';
        console.log(a, b);
    })
    main.style.top = '0px';
    //启动游戏模块按钮点击

    //游戏文件拖拽函数
    let dropArea = document.querySelector('#dropArea');
    let dropTips = document.querySelector('#dropTips');
    let dropPath = document.querySelector('#dropPath');
    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        let gamePathRep = /\\TCLS\\Client.exe/g;
        let files = e.dataTransfer.files;
        if (files && files.length > 0) {
            if (gamePathRep.test(files[0].path)) {
                dropPath.innerHTML = files[0].path;
                console.log(files[0].path);
                dropPath.style.color = 'white';
                store.set('gamePath',files[0].path);
                setTimeout(() => {
                    dropArea.style.animation = 'dropArea2 1s 1 forwards';
                    dropArea.addEventListener('animationend', () => {
                        dropArea.style.display = 'none';
                        dropArea.style.animation = 'dropArea1 1s 1 forwards';
                        dropArea.removeEventListener('animationend', () => {});
                    })
                }, 1500)
            } else {
                dropPath.innerHTML = files[0].path;
                dropPath.style.color = '#ff3700';
            }
        }
    });
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
    })

    function gamestart() {
        let gamePathRep = /\\TCLS\\Client.exe/g;
        let gamePath = store.get('gamePath');
        let stlad = document.querySelector('#st-loading');
        let gametf = gamePathRep.test(gamePath);
        if (gamePath) {
            if (gametf) {
                stlad.style.display = 'block';
                ipc.send('gameST', gamePath); //发送信息给主线程 让主线程启动游戏
                gst.removeEventListener('click',gamestart);
            }else{
                dropTips.innerHTML = '游戏路径不正确';
                dropArea.style.display = 'block';
            }
        } else {
            dropTips.innerHTML = '请设置游戏路径';
            dropArea.style.display = 'block';
        }
    }
    gst = document.querySelector('#game-start');
    gst.addEventListener('click', gamestart);
});