'use strict'

import Game from '/game.mjs';
import QOG from '/QOG.mjs';


window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');

document.oncontextmenu = (ev) =>{ev.preventDefault();ev.stopImmediatePropagation();};
new Game();

document.getElementById('mainMenu').onclick = document.getElementById('mainMenu').ontouchstart = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};

const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});
const QOGInit = new CustomEvent('GameInit',{});


document.getElementsByTagName('button').item(0).onclick = document.getElementsByTagName('button').item(0).ontouchstart =()=>{
    window.dispatchEvent(QOGCreation);
    console.log('creation done');
    window.dispatchEvent(QOGInit);
    console.log('init done');
};

/* document.getElementById('gameBoard').addEventListener('mousemove', e => {
    document.getElementById('mouse').innerHTML="X:"+e.offsetX+" Y:"+e.offsetY;
    document.getElementById('client-mouse').innerHTML="cX:"+e.clientX+" cY:"+e.clientY;
}); */
