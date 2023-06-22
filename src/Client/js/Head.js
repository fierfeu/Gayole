'use strict'

import Game from '/game.mjs';
import QOG from '/QOG.mjs';
import EPT from '/EPT.mjs';

globalThis.gameEventStorageWorker = new Worker('/storageWorker.js');
/*let msg = ["init","data"];

gameEventStorageWorker.addEventListener("message", (ev)=>{
    //alert (ev.data);
});
gameEventStorageWorker.postMessage(msg);*/

window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');
new Game();
const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});

//Game QOG creation
document.getElementById('QOG').onclick = document.getElementById('QOG').ontouchstart = () => {
    window.dispatchEvent(QOGCreation);
    document.getElementById('selectGame').classList.toggle('maxifiedSelectMenu');
};
//Game EPT creation
const EPTCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':EPT}});
document.getElementById('EPT').onclick = document.getElementById('EPT').ontouchstart = () => {
    window.dispatchEvent(EPTCreation);
    console.log('EPTCreation sent');
    document.getElementById('selectGame').classList.toggle('maxifiedSelectMenu');
};

//Menu management
document.oncontextmenu = (ev) =>{ev.preventDefault();ev.stopImmediatePropagation();};
document.getElementById('mainMenu').onclick = document.getElementById('mainMenu').ontouchstart = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};
// Creation button mamangement
document.getElementsByTagName('button').item(0).onclick = ()=>{
    document.getElementById('selectGame').classList.toggle('maxifiedSelectMenu');
};
document.getElementsByTagName('button').item(0).ontouchstart = document.getElementsByTagName('button').item(0).onclick;

/* document.getElementById('gameBoard').addEventListener('mousemove', e => {
    document.getElementById('mouse').innerHTML="X:"+e.offsetX+" Y:"+e.offsetY;
    document.getElementById('client-mouse').innerHTML="cX:"+e.clientX+" cY:"+e.clientY;
}); */
