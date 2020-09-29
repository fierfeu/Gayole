import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
const expect = chai.expect;

describe ('[QOG RUN] function work well',()=>{
    let gameManager ={};
    gameManager.currentGame = {};
    gameManager.units={};
    gameManager.zones ={};
    gameManager.currentScenario={};
     
    it('run function manage didacticiel',()=>{
        //
    });

    it('Run function reduce by one turnLeft',()=>{
        globalThis.window={};
        window.localStorage={};
        window.localStorage.setItem = ()=>{};
        gameManager.currentGame.turnLeft =1;
        QOG.prototype.run.call(gameManager);
        expect (gameManager.currentGame.turnLeft).to.equal(0);

        globalThis.window=undefined;
    });

    it('Run function initiate action point',()=>{
        globalThis.window={};
        window.localStorage={};
        window.localStorage.setItem = ()=>{};
        gameManager.currentGame.turnLeft =1;
    });
});