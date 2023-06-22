import EPT from '../../../../src/Client/mjs/EPT.mjs';
import unit from '../../../../src/Client/mjs/unit.mjs';
import {unitSet} from '../../../../src/Client/mjs/unitSet.mjs';
import zone from '../../../../src/Client/mjs/zone.mjs';
import scenario from '../../../../src/Client/mjs/scenario.mjs';

import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import sinon from 'sinon';

var window;
const EPMPTYHTML = `<html>
                        <body>
                            <div id='gameBoard' class='gameBoardHide' >
                                <div id='dialogZone' class='dialogZone'>
                                </div>
                                <div id='strategicMap' class='strategicMap'>
                                </div>
                            </div>
                        </body>
                    </html>`

describe('[EPT for gameManager] EPT prototype content good gameManager Interface', ()=>{
    const sandbox = sinon.createSandbox();

    after(()=>{
        sandbox.restore();
    })

    it('EPT prototype is defined', () => {
        expect(EPT).to.not.be.undefined;
    });


    it('has boards function',()=>{
        expect(EPT.prototype.boards).to.exist;
        expect(typeof EPT.prototype.boards).to.equal('function');
    });

    it('has setUp function',()=>{
        expect(EPT.prototype.setUp).to.exist;
        expect(typeof EPT.prototype.setUp).to.equal('function');
    });

    it('has getGameName function',()=>{
        expect(EPT.prototype.getGameName).to.exist;
        expect(typeof EPT.prototype.setUp).to.equal('function');
    });

    it('getGameName return EPT as game name', () => {
        expect(EPT.prototype.getGameName()).equal('EPT');
    })

    it ('running function exist', () => {
        expect(EPT.prototype.run).to.exist
        expect(typeof EPT.prototype.run).to.equal('function')
    })

});