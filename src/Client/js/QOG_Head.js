'use strict'

window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');

import Game from '/game.mjs';
import QOG from '/QOG.mjs';

document.oncontextmenu = (ev) =>{ev.preventDefault();ev.stopImmediatePropagation();};
new Game();

document.getElementById('mainMenu').onclick = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};
const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});
const QOGInit = new CustomEvent('GameInit',{});


document.getElementsByTagName('button').item(0).onclick = ()=>{
    window.dispatchEvent(QOGCreation);
    console.log('creation done');
    window.dispatchEvent(QOGInit);
    console.log('init done');
};

/* document.getElementById('gameBoard').addEventListener('mousemove', e => {
    document.getElementById('mouse').innerHTML="X:"+e.offsetX+" Y:"+e.offsetY;
    document.getElementById('client-mouse').innerHTML="cX:"+e.clientX+" cY:"+e.clientY;
}); */

