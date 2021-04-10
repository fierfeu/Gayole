import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
import unit from '../../../src/Client/mjs/unit.mjs';
import Zone from '../../../src/Client/mjs/zone.mjs'
import { unitSet } from '../../../src/Client/mjs/unitSet.mjs';
const expect = chai.expect;
import jsdom from 'jsdom';
import zone from '../../../src/Client/mjs/zone.mjs';
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
            globalThis.gameManager={};
            gameManager.units={};
            gameManager.zones ={};
            gameManager.currentGame={};
        });
    })

    afterEach (()=>{
        globalThis.window=undefined;
    })

    it('shows cost for current unit movement when enter a valid target zone',()=>{

        //unit dragged context
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        gameManager.units['myUYnit'] = new unit(goodImages,'myUnit','unit for test only');
        gameManager.unit2Move = gameManager.units['myUYnit'];
        // zones context
        // zone where the unit was
        gameManager.zones['Siwa'] = new Zone(
            document.getElementById('Siwa'),
            'Siwa',
        );
        gameManager.zones['Siwa'].attach(gameManager.units['myUYnit']);
        gameManager.fromZone = gameManager.zones['Siwa'];
        //zone where the unit should go
        gameManager.zones['Cross1'] = new Zone(
            document.getElementById('Cross1'),
            'Cross1',
        );
        gameManager.zones['Siwa'].linkTo(gameManager.zones['Cross1'],"0.5");
        let zoneTarget = document.getElementById('Cross1');
        //event context
        let event = {
            "dataTransfer" : {},
            "bubble" : true,
            "target" : {},
            preventDefault () {}
        };
        event.target= zoneTarget;
        // Action points context
        let actionPoints =4;
        document.getElementById('PA').getElementsByTagName('span')[0].innerText = ''+actionPoints;

        //test
        const MVTcost = document.getElementById('MVTcost');
        let coords=zoneTarget.getAttribute('coords');
        coords=coords.split(',');
        expect(()=>{QOG.prototype.dragEnterHandler(event)}).to.not.throw();
        expect (MVTcost.className).to.not.contain('gameBoardHide');
        expect(MVTcost.style.left).to.equal(coords[2]+'px');
        let top = parseInt(coords[3])+80;
        expect(MVTcost.style.top).to.equal(top+'px');
        expect(MVTcost.innerText).to.equal('-1');

    })

    it('hide cost for current unit movement when leave a valid target zone',()=>{
        const MVTcost = document.getElementById('MVTcost');
        let event = {
            preventDefault () {}
        }
        expect(()=>{QOG.prototype.dragLeaveHandler(event)}).to.not.throw();
        expect (MVTcost.className).to.contain('gameBoardHide');
    });

    it('substract movement cost to action points for a valid movement',() =>{
        //unit dragged context
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        gameManager.units['1st Patrol'] = new unit(goodImages,'1st Patrol','unit for test only');
        gameManager.unit2Move = gameManager.units['1st Patrol'];
        let piece = document.createElement('img');
        piece.className = "unit";
        piece.src=gameManager.unit2Move.images['recto'];
        piece.name = gameManager.unit2Move.name;
        piece.draggable = "true";
        piece.id=gameManager.unit2Move.name.replace(/\s+/g, '') + Date.now();
        document.getElementById('strategicMap').append(piece);        
        // zones context
        // zone where the unit was
        gameManager.zones['Siwa'] = new Zone(
            document.getElementById('Siwa'),
            'Siwa',
        );
        gameManager.zones['Siwa'].attach(gameManager.units['1st Patrol']);
        gameManager.fromZone = gameManager.zones['Siwa'];
        //zone where the unit should go
        gameManager.zones['Cross1'] = new Zone(
            document.getElementById('Cross1'),
            'Cross1',
        );
        gameManager.zones['Siwa'].linkTo(gameManager.zones['Cross1'],"0.5");
        let zoneTarget = document.getElementById('Cross1');
        //event context
        let event = {
            "dataTransfer" : {},
            "bubble" : true,
            "target" : {},
            preventDefault () {}
        };
        event.target= zoneTarget;
        // Action points context
        let actionPoints =4;
        document.getElementById('PA').getElementsByTagName('span')[0].innerText = ''+actionPoints;

        //test
        const MVTcost = document.getElementById('MVTcost');
        expect(()=>{QOG.prototype.dragEnterHandler(event)}).to.not.throw();
        const cost = parseInt(MVTcost.innerText);
        expect(()=>{QOG.prototype.dropHandler(event)}).to.not.throw();
        const ramainingActionPoints = parseInt (document.getElementById('PA').getElementsByTagName('span')[0].innerText);
        expect(ramainingActionPoints).to.equal(actionPoints+cost);
    });

    
    it('disallows movement according to actions points',()=>{
        //unit dragged context
        let goodImages=[];
        goodImages['recto']='/recto123.png';
        goodImages['verso']='/verso123.png';
        gameManager.units['1st Patrol'] = new unit(goodImages,'1st Patrol','unit for test only');
        gameManager.unit2Move = gameManager.units['1st Patrol'];
        let piece = document.createElement('img');
        piece.className = "unit";
        piece.src=gameManager.unit2Move.images['recto'];
        piece.name = gameManager.unit2Move.name;
        piece.draggable = "true";
        piece.id=gameManager.unit2Move.name.replace(/\s+/g, '') + Date.now();
        document.getElementById('strategicMap').append(piece);        
        // zones context
        // zone where the unit was
        gameManager.zones['Siwa'] = new Zone(
            document.getElementById('Siwa'),
            'Siwa',
        );
        gameManager.zones['Siwa'].attach(gameManager.units['1st Patrol']);
        gameManager.fromZone = gameManager.zones['Siwa'];
        //zone where the unit should go
        gameManager.zones['Cross1'] = new Zone(
            document.getElementById('Cross1'),
            'Cross1',
        );
        gameManager.zones['Siwa'].linkTo(gameManager.zones['Cross1'],"0.5");
        let zoneTarget = document.getElementById('Cross1');
        //event context
        let event = {
            "dataTransfer" : {},
            "bubble" : true,
            "target" : {},
            preventDefault () {}
        };
        event.target= zoneTarget;
        // Action points context
        let actionPoints =0;
        document.getElementById('PA').getElementsByTagName('span')[0].innerText = ''+actionPoints;

        //test
        const MVTcost = document.getElementById('MVTcost');
        expect(()=>{QOG.prototype.dragEnterHandler(event)}).to.not.throw();
        let cost = parseInt(MVTcost.innerText);
        expect(cost).to.be.NaN;
        cost = MVTcost.innerText;
        expect (cost).to.equal('No');
    });
})
