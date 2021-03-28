import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
import unit from '../../../src/Client/mjs/unit.mjs';
import { unitSet } from '../../../src/Client/mjs/unitSet.mjs';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;

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

    it('Run function initiate action point for one patrol',()=>{
        globalThis.window= new JSDOM('<html><div id="PA"><span></span></div></html>',{url:'http://localhost'}).window;
        globalThis.document = window.document;
        gameManager.currentGame.turnLeft =1;
        let goodImages=[];
        let units=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        const goodUnit1 = new unit(goodImages,'myUnit1','unit for test only');
        const goodUnit2 = new unit(goodImages,'myUnit2','unit for test only');
        units.push(goodUnit1);
        units.push(goodUnit2);
        let myUnitSet;
        myUnitSet=new unitSet(goodImages,'myUnitSet','this is a patrol with 2 units',units);
        gameManager.units["Patrol1"]=myUnitSet;

        QOG.prototype.run.call(gameManager);
        expect (gameManager.currentGame.patrolNb).to.equal(1);
        expect(gameManager.units["Patrol1"].actionPoints).to.above(2);

        globalThis.window = globalThis.document = undefined;
    });
});

describe ('[QOG run Movement] verify that movement action is well managed',()=>{

    beforeEach (async ()=>{
        await JSDOM.fromFile ('src/Client/html/boardGame.html',{
            url:'http://localhost', 
            pretendToBeVisual: true,
            runScripts:"dangerously"
        }).then((dom)=>{
            globalThis.window = dom.window;
            globalThis.document = window.document;
        });
    })

    afterEach (()=>{
        globalThis.window=undefined;
    })

    it('shows cost for current unit movement when enter a valid target zone',()=>{
        const MVTcost = document.getElementById('MVTcost');
        let event = {
            "dataTransfert" : {},
            "bubble" : true,
            "target" : {},
            preventDefault () {}
        };
        let zoneTarget = document.getElementById('Cross1');
        event.target= zoneTarget;
        let coords=zoneTarget.getAttribute('coords');
        coords=coords.split(',');

        expect(()=>{QOG.prototype.dragEnterHandler(event)}).to.not.throw();
        expect (MVTcost.className).to.not.contain('gameBoardHide');
        expect(MVTcost.style.left).to.equal(coords[2]+'px');
        let top = parseInt(coords[3])+80;
        expect(MVTcost.style.top).to.equal(top+'px');

    })

    it('hide cost for current unit movement when leave a valid target zone',()=>{
        const MVTcost = document.getElementById('MVTcost');
        let event = {
            preventDefault () {}
        }
        expect(()=>{QOG.prototype.dragLeaveHandler(event)}).to.not.throw();
        expect (MVTcost.className).to.contain('gameBoardHide');
    })
})