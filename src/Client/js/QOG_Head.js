'use strict'

// testable with protractor only
// Only initiate default value in storage

window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');

import Game from '/game.mjs';
import QOG from '/QOG.mjs';

//globalThis.game = QOG.prototype;
new Game();

document.getElementById('mainMenu').onclick = ()=>{
    document.getElementById('mainMenu').classList.toggle('maxifiedMainMenu');
};
const QOGCreation = new CustomEvent('GameCreation',{'detail':{'gameInterface':QOG}});
const QOGInit = new CustomEvent('GameInit',{});


document.getElementsByTagName('button').item(0).onclick = ()=>{
    window.dispatchEvent(QOGCreation);
    window.dispatchEvent(QOGInit)
};