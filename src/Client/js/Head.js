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
const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});
document.getElementById('QOG').onclick = document.getElementById('QOG').ontouchstart = () => {
    window.dispatchEvent(QOGCreation);
    document.getElementById('selectGame').classList.toggle('maxifiedSelectMenu');};
const EPTCreation = new CustomEvent('GameCreation',{'details':{'gameInterface':EPT}});
document.getElementById('EPT').onclick = document.getElementById('EPT').ontouchstart = () => {
    window.dispatchEvent(EPTCreation);
    document.getElementById('selectGame').classList.toggle('maxifiedSelectMenu');};
new Game();

document.oncontextmenu = (ev) =>{ev.preventDefault();ev.stopImmediatePropagation();};
document.getElementById('mainMenu').onclick = document.getElementById('mainMenu').ontouchstart = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};

// first button mamangement
document.getElementsByTagName('button').item(0).onclick = ()=>{
    document.getElementById('selectGame').classList.toggle('maxifiedSelectMenu');
    //
    console.log('creation done'); // to be replaced by event storage
};
document.getElementsByTagName('button').item(0).ontouchstart = document.getElementsByTagName('button').item(0).onclick;

/* document.getElementById('gameBoard').addEventListener('mousemove', e => {
    document.getElementById('mouse').innerHTML="X:"+e.offsetX+" Y:"+e.offsetY;
    document.getElementById('client-mouse').innerHTML="cX:"+e.clientX+" cY:"+e.clientY;
}); */
