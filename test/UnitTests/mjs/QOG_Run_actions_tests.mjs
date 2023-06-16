import QOG from '../../../src/Client/mjs/QOG.mjs';
import chai from 'chai';
import Game from '../../../src/Client/mjs/game.mjs'
import unit from '../../../src/Client/mjs/unit.mjs';
import Zone from '../../../src/Client/mjs/zone.mjs'
import { unitSet } from '../../../src/Client/mjs/unitSet.mjs';
const expect = chai.expect;
import jsdom from 'jsdom';
import sinon from 'sinon';
const {JSDOM} = jsdom;


describe('[QOG context Menu] manage a contextual menu for unit and zone',()=>{
    it('has a context menu Handler',()=>{
        //context
        
        globalThis.gameManager = undefined;
        globalThis.window = new JSDOM('').window;
        new Game();
        gameManager.currentGame.gameInterface=QOG;

        //tests
        expect(gameManager.currentGame.gameInterface.prototype.contextMenuHandler).to.exist;

        //restore context
        globalThis.window=undefined;
        globalThis.gameManager = undefined;
    });

    it('Context Menu Handler set good environment',async ()=>{
        //context
        const HTML = `<body>
                        <img class="unit" src="/patrol1.png" name="1st Patrol" draggable="true" id="1stPatrol" style="position: absolute; left: 738px; top: 482px;"> 
                        <div id='dialogWindow'></div>
                        <div id='strategicMap'>
                            <map name='gameBoardMap'>
                                <area shape='rect' coords='722,400,767,445' id='Cross1' data-ground='Desert_sand' data-links='Cross2:1;Cross6:1;Siwa:1;Jagahbub:2'>
                                <area shape='rect' coords='604,405,650,451' id='Jagahbub' data-ground='Village,Oasis' data-links='Cross7:1;ElCuasc:1;FortMaddalena:1;Cross1:2;LongCross1:1;Cross9:1;Cross10:2'>
                                <area shape='rect' id='Siwa' data-ground='Desert_sand,Oasis' data-arrival='available' data-links='Cross1:1;Koufra:1;LongCross1:1' coords='733,477,780,523'>                
                            </map>
                        </div>
                        <div id='contextualContainer'></div>
                      </body>`;
        const MENU = `<div id='actionMenu'>
                        <div class='title' style="text-align:center;"><span>Actions</span></div>
                        <hr>
                        <div id='intelligence' class="unitAction" data-help="helper.intelligence" onclick="QOG.prototype.performAction(ev)">
                            <div class="actionCost">2</div>
                            <span>Intelligence action</span>
                        </div>
                    </div>
                    <div id="help" style="display:none; position:relative"></div>`;
        globalThis.window = new JSDOM(HTML).window;
        globalThis.document = window.document;
        globalThis.gameManager = {};
        gameManager.currentGame = {};
        gameManager.units={}
        gameManager.load = 0;
        gameManager.entry = false;
        gameManager.loadExternalRessources = (opts) => {
            if (opts.url == '/en/actionsMenu.html') {
                gameManager.entry = true;
                return new Promise((resolve,reject)=>{resolve(MENU)});
            }

        };
        const piece = document.getElementById('1stPatrol');
        const contextSpy = sinon.spy(QOG.prototype,"contextMenuHandler");
        piece.addEventListener('contextmenu',QOG.prototype.contextMenuHandler);
        const mySpy = sinon.spy();
        window.addEventListener('error',mySpy);
        const event = new window.MouseEvent('contextmenu');
        const closeContextSpy = sinon.spy(QOG.prototype,"closeContextMenuHandler");
        //Patrol init
        let goodImages={}
        let units=[]
        goodImages['recto']='/recto123.png'
        goodImages['verso']='/verso123.png'
        const goodUnit1 = new unit(goodImages,'myUnit1','unit for test only')
        const goodUnit2 = new unit(goodImages,'myUnit2','unit for test only')
        units.push(goodUnit1)
        units.push(goodUnit2)
        const myUnitSet=new unitSet(goodImages,'myUnitSet','this is a patrol with 2 units',units)
        gameManager.units["Patrol1"]=myUnitSet
        const myZone= new Zone (document.getElementById('Jagahbub'),'Jagahbub',{'ground':'Village,Oasis'})
        const intelligenceActionValidStub = sinon.stub(QOG.prototype,"intelligenceActionValid").returns([myZone]);

        //test
        await piece.dispatchEvent(event);
        expect(mySpy.notCalled).to.true;
        expect(contextSpy.calledOnce).to.true;
        expect(piece.className).to.contain('dragged');
        expect (gameManager.currentGame.currentUnit).to.equal(piece.id);
        expect(gameManager.entry).to.true;
        const menuContent = document.getElementById('contextualContainer');
        expect(menuContent.innerHTML).to.contain('<div id="actionMenu">');
        const clickEv = new window.MouseEvent('click');
        document.getElementById('strategicMap').dispatchEvent(clickEv);
        expect(closeContextSpy.calledOnce).to.true;
        expect(document.getElementById('contextualContainer').style.display).to.equal('none');
   
        //restore context   
        intelligenceActionValidStub.restore() 
        closeContextSpy.restore();
        contextSpy.restore();
        globalThis.document = undefined;
        globalThis.window = undefined;
        globalThis.gameManager = undefined;
    });
});

describe('[QOG Intelligence action] is well managed', ()=>{
    it('is possible to detect if valid intelligence zone is available for a patrol',()=>{
        //context
        const HTML = `<body>
                        <img class="unit" src="/patrol1.png" name="1st Patrol" draggable="true" id="1stPatrol" style="position: absolute; left: 738px; top: 482px;"> 
                        <div id='dialogWindow'></div>
                        <div id='strategicMap'>
                            <map name='gameBoardMap'>
                                <area shape='rect' coords='722,400,767,445' id='Cross1' data-ground='Desert_sand' data-links='Cross2:1;Cross6:1;Siwa:1;Jagahbub:2'>
                                <area shape='rect' coords='604,405,650,451' id='Jagahbub' data-ground='Village,Oasis' data-links='Cross7:1;ElCuasc:1;FortMaddalena:1;Cross1:2;LongCross1:1;Cross9:1;Cross10:2'>
                                <area shape='rect' id='Siwa' data-ground='Desert_sand,Oasis' data-arrival='available' data-links='Cross1:1;Koufra:1;LongCross1:1' coords='733,477,780,523'>                
                            </map>
                        </div>
                        <div id='contextualContainer'></div>
                    </body>`
        globalThis.window = new JSDOM(HTML).window
        globalThis.document = window.document
        globalThis.gameManager = {}
        gameManager.units={}
        gameManager.zones={}
        gameManager.currentGame = {}
        //Patrol init
        let goodImages={}
        let units=[]
        goodImages['recto']='/recto123.png'
        goodImages['verso']='/verso123.png'
        const goodUnit1 = new unit(goodImages,'myUnit1','unit for test only')
        const goodUnit2 = new unit(goodImages,'myUnit2','unit for test only')
        units.push(goodUnit1)
        units.push(goodUnit2)
        const myUnitSet=new unitSet(goodImages,'myUnitSet','this is a patrol with 2 units',units)
        gameManager.units["Patrol1"]=myUnitSet
        // zones init
        gameManager.zones['Siwa'] = new Zone(
            document.getElementById('Siwa'),
            'Siwa')
        gameManager.zones['Cross1'] = new Zone(
            document.getElementById('Cross1'),
            'Cross1')
        gameManager.zones['Jagahbub'] = new Zone(
            document.getElementById('Jagahbub'),
            'Jagahbub',{"ground":document.getElementById('Jagahbub').dataset.ground})
        gameManager.zones['Siwa'].attach(gameManager.units["Patrol1"])
        gameManager.zones['Siwa'].linkTo(gameManager.zones['Cross1'],1)
        gameManager.zones['Cross1'].linkTo(gameManager.zones['Siwa'],1)
        gameManager.zones['Cross1'].linkTo(gameManager.zones['Jagahbub'],1)

        //test
        expect(QOG.prototype.intelligenceActionValid).to.exist
        expect(Array.isArray(QOG.prototype.intelligenceActionValid(gameManager.units["Patrol1"]))).to.true
        expect(QOG.prototype.intelligenceActionValid(gameManager.units["Patrol1"])).to.empty

        gameManager.zones['Siwa'].moveTo(gameManager.zones['Cross1'],gameManager.units["Patrol1"])     
        expect(QOG.prototype.intelligenceActionValid(gameManager.units["Patrol1"]).length).to.equal(1)
        expect(QOG.prototype.intelligenceActionValid(gameManager.units["Patrol1"])[0]).to.equal(gameManager.zones['Jagahbub'])
    })
})
