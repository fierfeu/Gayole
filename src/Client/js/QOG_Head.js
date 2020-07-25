'use strict'

// testable with protractor only
// Only initiate default value in storage

window.localStorage.setItem('user','null');
localStorage.setItem('gameLaunched','false');

import Menu from '/menu.mjs';
import Game from '/game.mjs';
import QOG from '/QOG.mjs';

//globalThis.game = QOG.prototype;
new Game();

let mainMenu = new Menu(document.getElementById('mainMenu'),'minifiedMainMenu','maxifiedMainMenu');
document.getElementById('mainMenu').onclick = ()=>{mainMenu.toggle()};
document.getElementsByTagName('button').item(0).onclick = ()=>{gameManager.create(QOG)};