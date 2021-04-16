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
    it('has a context menu for a patrol',()=>{
        //context
        const HTML = `<body>
                        <img class="unit" src="/patrol1.png" name="1st Patrol" draggable="true" id="1stPatrol" style="position: absolute; left: 738px; top: 482px;"> 
                      </body>`;
        globalThis.gameManager = undefined;
        globalThis.gameManager = new Game();
        gameManager.curentGame.gameInterface=QOG;

        //tests
        expect(gameManager.currentGame.gameInterface.prototype.contextMenuHandler).to.exist;

    
    });

    it('has a contextual menu for a single unit',()=>{

    });
});
