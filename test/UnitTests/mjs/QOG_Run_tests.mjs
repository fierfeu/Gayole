import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
const expect = chai.expect;

describe ('[QOG RUN] function work well',()=>{
    
    it('run function manage didacticiel',()=>{
        //
    });

    it('Run function reduce by one turnLeft',()=>{
        globalThis.gameManager ={};
        globalThis.window={};
        window.localStorage={};
        window.localStorage.setItem = ()=>{};
        gameManager.currentGame = {};
        gameManager.units={};
        gameManager.zones ={};
        gameManager.currentScenario={};
        gameManager.currentGame.turnLeft =1;
        QOG.prototype.run.call(gameManager);
        expect (gameManager.currentGame.turnLeft).to.equal(0);
    });
});