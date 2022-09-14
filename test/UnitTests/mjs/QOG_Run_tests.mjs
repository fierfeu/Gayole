import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
import unit from '../../../src/Client/mjs/unit.mjs';
import Zone from '../../../src/Client/mjs/zone.mjs'
import { unitSet } from '../../../src/Client/mjs/unitSet.mjs';
const expect = chai.expect;
import jsdom from 'jsdom';
import sinon from 'sinon';
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

    it('Run function initiate action point for patrols',()=>{
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
        expect(gameManager.units["Patrol1"].actionPoints).to.be.within(3,8);
        // test for 4 to 8 unit in patrol
        const goodUnit3 = new unit(goodImages,'myUnit3','unit for test only');
        const goodUnit4 = new unit(goodImages,'myUnit4','unit for test only');
        units.push(goodUnit3);
        units.push(goodUnit4);
        myUnitSet=new unitSet(goodImages,'myUnitSet','this is a patrol with 4 units',units);
        gameManager.units["Patrol1"]=myUnitSet;
        QOG.prototype.run.call(gameManager);
        expect (gameManager.currentGame.patrolNb).to.equal(1);
        expect(gameManager.units["Patrol1"].actionPoints).to.be.within(4,14);
        // test for 9+ unit in patrol
        const goodUnit5 = new unit(goodImages,'myUnit5','unit for test only');
        const goodUnit6 = new unit(goodImages,'myUnit6','unit for test only');
        const goodUnit7 = new unit(goodImages,'myUnit7','unit for test only');
        const goodUnit8 = new unit(goodImages,'myUnit8','unit for test only');
        const goodUnit9 = new unit(goodImages,'myUnit9','unit for test only');
        units.push(goodUnit5);
        units.push(goodUnit6);
        units.push(goodUnit7);
        units.push(goodUnit8);
        units.push(goodUnit9);
        myUnitSet=new unitSet(goodImages,'myUnitSet','this is a patrol with 4 units',units);
        gameManager.units["Patrol1"]=myUnitSet;
        QOG.prototype.run.call(gameManager);
        expect (gameManager.currentGame.patrolNb).to.equal(1);
        expect(gameManager.units["Patrol1"].actionPoints).to.be.within(5,20);

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
        let top = parseInt(coords[3])+95;
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

describe('[QOG run Movement] Discretion test is working well', () =>{
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
            gameManager.currentGame=QOG;
        });
    });

    it('QOG has a function to test discretion called by zone event manager',()=>{
        expect(QOG.prototype.performDiscretionTest).to.exist;
        expect(()=>{QOG.prototype.performDiscretionTest()}).to.Throw();
        expect(()=>{QOG.prototype.performDiscretionTest('test')}).to.Throw('performDiscretionTest must be called throught a customeEvent firing process');
        const zone = document.getElementById('Cross1');
        const ev = new window.CustomEvent('discretiontest',{detail: {NbOfUnit:1}});
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        const error = sinon.spy();
        window.addEventListener('error',error)
        //'performDiscretionTest must be called throught a customeEvent firing process'
        zone.dispatchEvent(ev);
        expect(error.called).to.false;
        const ev2 = new window.Event('discretiontest');
        zone.dispatchEvent(ev2);
        expect(error.called).to.true;
    });

    it('roll the good number of dice according to zone ground',() =>{
        expect(QOG.prototype.diceRoll).to.exist;
        const diceRollSpy = sinon.spy(QOG.prototype,"diceRoll");
        const ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:1}})
        // test with Desert sand ground Cross1
        let zone = document.getElementById('Cross1');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledOnce).to.true;
        diceRollSpy.resetHistory();
        //test with desert rocky ground Cross2
        zone = document.getElementById('Cross2');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledOnce).to.true;
        diceRollSpy.resetHistory();
        //test with village ground Jagahbub
        zone = document.getElementById('BenGania');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledTwice).to.true;
        diceRollSpy.resetHistory();
        //test with oasis ground Jalo
        zone = document.getElementById('Jalo');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledTwice).to.true;
        diceRollSpy.resetHistory();
        //test with Town ground Marsa Al Brega
        zone = document.getElementById('MarsaAlBrega');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledThrice).to.true;
        diceRollSpy.resetHistory();
        //test with Fort ground Tobrouk
        zone = document.getElementById('Tobrouk');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledThrice).to.true;
        diceRollSpy.resetHistory();
        //test with Airport ground El Adem
        zone = document.getElementById('ElAdem');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(diceRollSpy.calledThrice).to.true;
        diceRollSpy.restore();
    });

    it('called alarm rising level if one dice is over 6',()=>{
        expect(QOG.prototype.diceRoll).to.exist;
        expect(QOG.prototype.increaseAlarmLevel).to.exist;
        const diceRollStub = sinon.stub(QOG.prototype,"diceRoll").returns(6);
        const increaseAlarmLevelspy = sinon.spy(QOG.prototype,"increaseAlarmLevel");
        const ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:1}})
        // test with Desert sand ground Cross1 to be sure to fire alarm
        let zone = document.getElementById('Cross1');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.true;
        diceRollStub.restore();
        increaseAlarmLevelspy.restore();
    });
    
    it('add the good modifier according to Nb of units',()=>{
        expect(QOG.prototype.diceRoll).to.exist;
        expect(QOG.prototype.increaseAlarmLevel).to.exist;
        const increaseAlarmLevelspy = sinon.spy(QOG.prototype,"increaseAlarmLevel");
        // test with one unit and Desert sand
        const diceRollStub = sinon.stub(QOG.prototype,"diceRoll").returns(6);
        let ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:1}})
        let zone = document.getElementById('Cross1');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.true;
        increaseAlarmLevelspy.resetHistory();
        diceRollStub.resetBehavior();
        diceRollStub.returns(5);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.false;
        increaseAlarmLevelspy.resetHistory();
        // test with 4 unit and desert sand
        ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:4}});
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.true;
        increaseAlarmLevelspy.resetHistory();
        diceRollStub.resetBehavior();
        diceRollStub.returns(4);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.false;
        increaseAlarmLevelspy.resetHistory();
        // test wit 7 units and Desert sand
        ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:7}});
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.true;
        increaseAlarmLevelspy.resetHistory();
        diceRollStub.resetBehavior();
        diceRollStub.returns(3);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.false;
        increaseAlarmLevelspy.resetHistory();
        // test with 9 unit and DEsert sand
        ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:9}});
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.true;
        increaseAlarmLevelspy.resetHistory();
        diceRollStub.resetBehavior();
        diceRollStub.returns(2);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.false;
        increaseAlarmLevelspy.resetHistory();
        // test with 4 units and Desert Rocky
        zone = document.getElementById('Cross2');
        zone.addEventListener('discretiontest',QOG.prototype.performDiscretionTest);
        ev = new window.CustomEvent('discretiontest', {detail:{NbOfUnits:4}});
        diceRollStub.resetBehavior();
        diceRollStub.returns(6);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.true;
        increaseAlarmLevelspy.resetHistory();
        diceRollStub.resetBehavior();
        diceRollStub.returns(5);
        zone.dispatchEvent(ev);
        expect(increaseAlarmLevelspy.calledOnce).to.false;
        increaseAlarmLevelspy.resetHistory();

        diceRollStub.restore();
        increaseAlarmLevelspy.restore();
    });

    it('alarm view is well manage',()=>{
        gameManager.currentGame.alarmLevel=1;
        expect(QOG.prototype.increaseAlarmLevel).to.exist;
        const view = document.getElementById('alarm');
        view.style.backgroundPositionX='-56px';
        expect(()=>[QOG.prototype.increaseAlarmLevel(-1)]).to.not.throw();
        expect(gameManager.currentGame.alarmLevel).to.equal(0);
        expect(view.style.backgroundPositionX).to.equal('0px');
        QOG.prototype.increaseAlarmLevel();
        expect(gameManager.currentGame.alarmLevel).to.equal(1);
        expect(view.style.backgroundPositionX).to.equal('-56px');
    });

    it('drop event fire discretion test if drop ok',() =>{
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
            preventDefault () {}
        };
        event.target= zoneTarget;
        // Action points context
        let actionPoints =4; // it's enought to performe 2 movements
        document.getElementById('PA').getElementsByTagName('span')[0].innerText = ''+actionPoints;
        //stub diceRoll to manage alarm output
        const diceRollStub = new sinon.stub(QOG.prototype,'diceRoll');
        //spies
        const discretionSpy = new sinon.spy(QOG.prototype,'performDiscretionTest')

        //test first move with diceroll = 1
        diceRollStub.returns(1);
        QOG.prototype.dragEnterHandler(event);
        expect(()=>{QOG.prototype.dropHandler(event)}).to.not.throw();
        expect(discretionSpy.calledOnce).to.true;
    })
})
