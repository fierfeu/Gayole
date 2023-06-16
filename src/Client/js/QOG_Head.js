'use strict'

import Game from '/game.mjs';
import QOG from '/QOG.mjs';


window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');

new Game();

document.oncontextmenu = (ev) =>{ev.preventDefault();ev.stopImmediatePropagation();};
document.getElementById('mainMenu').onclick = document.getElementById('mainMenu').ontouchstart = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};
const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});
const QOGInit = new CustomEvent('GameInit',{});


document.getElementsByTagName('button').item(0).onclick = ()=>{
    window.dispatchEvent(QOGCreation);
};
