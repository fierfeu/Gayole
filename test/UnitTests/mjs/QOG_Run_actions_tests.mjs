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

    it('Context Menu Hnadler set good environment',async ()=>{
        //context
        const HTML = `<body>
                        <img class="unit" src="/patrol1.png" name="1st Patrol" draggable="true" id="1stPatrol" style="position: absolute; left: 738px; top: 482px;"> 
                        <div id='dialogWindow'></div>
                        <div id='strategicMap'></div>
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
        const JSONString = `{
                                "helper" : {
                                    "actionMenu":{
                                        "sendUnit":"Second a unit but keep the unit linked to the patrol for action points calculation and allow to move the unit or perform a unit action",
                                        "intelligence":"Command a unit to begin an intelligence action"
                                    }
                                }
                            }`;
        globalThis.window = new JSDOM(HTML).window;
        globalThis.document = window.document;
        globalThis.gameManager = {};
        gameManager.currentGame = {};
        gameManager.load = 0;
        gameManager.entry = false;
        gameManager.loadExternalRessources = (opts) => {
            if (opts.url == '/en/actionsMenu.html') {
                gameManager.entry = true;
                return new Promise((resolve,reject)=>{resolve(MENU)});
            }

        };
        const unit = document.getElementById('1stPatrol');
        const contextSpy = sinon.spy(QOG.prototype,"contextMenuHandler");
        unit.addEventListener('contextmenu',QOG.prototype.contextMenuHandler);
        const mySpy = sinon.spy();
        window.addEventListener('error',mySpy);
        const event = new window.MouseEvent('contextmenu');
        const closeContextSpy = sinon.spy(QOG.prototype,"closeContextMenuHandler");

        //test
        await unit.dispatchEvent(event);
        expect(mySpy.notCalled).to.true;
        expect(contextSpy.calledOnce).to.true;
        expect(unit.className).to.contain('dragged');
        expect (gameManager.currentGame.currentUnit).to.equal(unit.id);
        expect(gameManager.entry).to.true;
        const menuContent = document.getElementById('contextualContainer');
        expect(menuContent.innerHTML).to.contain('<div id="actionMenu">');
        expect(menuContent.style.display).to.equal('block');
        expect(document.getElementById('strategicMap').onclick).to.equal(QOG.prototype.closeContextMenuHandler);
        const clickEv = new window.MouseEvent('click');
        document.getElementById('strategicMap').dispatchEvent(clickEv);
        expect(closeContextSpy.calledOnce).to.true;
        expect(document.getElementById('contextualContainer').style.display).to.equal('none');
   
        //restore context    
        closeContextSpy.restore();
        contextSpy.restore();
        globalThis.document = undefined;
        globalThis.window = undefined;
        globalThis.gameManager = undefined;
    });
});
