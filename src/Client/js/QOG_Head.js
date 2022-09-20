'use strict'

import Game from '/game.mjs';
import QOG from '/QOG.mjs';


window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');
const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});
new Game();

document.oncontextmenu = (ev) =>{ev.preventDefault();ev.stopImmediatePropagation();};
document.getElementById('mainMenu').onclick = document.getElementById('mainMenu').ontouchstart = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};

// first button mamangement
document.getElementsByTagName('button').item(0).onclick = ()=>{
    window.dispatchEvent(QOGCreation);
    console.log('creation done'); // to be replaced by event storage
};
document.getElementsByTagName('button').item(0).ontouchstart = document.getElementsByTagName('button').item(0).onclick;

/* document.getElementById('gameBoard').addEventListener('mousemove', e => {
    document.getElementById('mouse').innerHTML="X:"+e.offsetX+" Y:"+e.offsetY;
    document.getElementById('client-mouse').innerHTML="cX:"+e.clientX+" cY:"+e.clientY;
}); */
