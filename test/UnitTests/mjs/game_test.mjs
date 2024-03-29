import assert from 'node:assert/strict';
import Game from '../../../src/Client/mjs/game.mjs';
import Event from 'events';
import EventTarget from 'events';

import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import sinon from 'sinon';

const HTML = "<!doctype html><html><body></body></html>";

describe('[Game] game creation tests',()=>{
    beforeEach(()=>{
        global.window= new JSDOM(HTML,{url:'http://localhost',pretendToBeVisual: true, runScripts:"dangerously"}).window;
        globalThis.gameManager = undefined;
    });

    afterEach(()=>{
        global.window = undefined
    });

    it('is possible to instanciate one and only one game manager',()=>{
        
        expect(()=>{new Game()}).to.not.throw();
        expect (globalThis.gameManager).to.exist;
        expect (globalThis.gameManager.create).to.exist;
        expect(gameManager.getSequence).to.exist;
        
        const currentSequence = gameManager.getSequence();
        expect(currentSequence[0]).to.equal('boards');
        expect(()=>{new Game()}).to.throw(); // singleton !

        
    });

    it ('is possible to instanciate one game manager in a window context',()=>{
        const gameClassString = Game.toString();
        
        window.addEventListener('test',()=>{});
        window.eval(gameClassString +"new Game();");
        expect(window.eval("globalThis.gameManager")).to.exist;
        expect(window.eval("window.gameManager")).to.exist;
        expect(window.gameManager.create).to.exist;
        const eventSpy = sinon.spy(window.gameManager,"create");
        class GoodGameInterface { 
            getGameName () {return 'QOG'}
            boards () {this.boardsOk=true;}
            setUp () {this.setupOK=true;}
        }
        expect(window.eval(
            GoodGameInterface.toString() +"\n"+
            "const GameCreation = new CustomEvent('GameCreation', {'detail':{'gameInterface':GoodGameInterface}});"+
            "window.dispatchEvent(GameCreation)")).to.true;
        expect(eventSpy.calledOnce).to.true;

        eventSpy.restore();
    });

    it ('new game instanciation is wellmanage with a game prototype', ()=>{
        new Game();
        class Empty {}
        Empty.prototype.constructor = 'test';
        globalThis.CustomEvent = Event;

        assert.rejects (async()=>{await gameManager.create()});
        assert.rejects (async()=>{await gameManager.create('TOTO')},
            (err)=>{assert.strictEqual(err.message, 'ERROR Bad Game interface provided : expect a class constructor and received a string');
            return true;});
            assert.rejects(async ()=>{await gameManager.create(Empty)},
                (err)=>{assert.strictEqual(err.message, 'ERROR BAD Game interface is Empty');
                return true;});

        class BadBoards {
            getGameName () {return 'toto'}
        }
        BadBoards.prototype.boards='test';
        assert.rejects (async () => {await gameManager.create(BadBoards)},
            (err) =>{
                assert.strictEqual(err.message,'ERROR BAD Game interface in BadBoards : boards is not a function');
                return true;
            }
        );
        class GoodBoards {
            getGameName () {}
            boards () {}};
        assert.rejects (async () => {await gameManager.create(BadBoards)},
            (err) =>{
                assert.strictEqual(err.message,'ERROR BAD Game interface in GoodBoards : setUp not available');
                return true;
            }
        );

        class GoodSetUp {getGameName () {return 'toto'}
        setUp () {}};
        assert.rejects (async () => {await gameManager.create(BadBoards)},
            (err) =>{
                assert.strictEqual(err.message,'ERROR BAD Game interface in GoodSetUp : boards not available');
                return true;
            }
        );

        gameManager.boardsOk = false;
        class GoodGameInterface { 
            getGameName () {return 'QOG'}
            boards () {this.boardsOk=true;}
            setUp () {this.setupOK=true;}
        }
        assert.doesNotReject(async ()=>{await gameManager.create(GoodGameInterface)});
        expect(gameManager.currentGame.name).to.equal('QOG');


        const GoodCustomEvent = new CustomEvent('GameCreation');// as it is, in fact, a nodejs Event we must add detail datas
        GoodCustomEvent.detail={};
        GoodCustomEvent.detail.gameInterface=GoodGameInterface;
        assert.doesNotReject(async ()=>{await gameManager.create(GoodCustomEvent)});
        expect(gameManager.currentGame.name).to.equal('QOG');

        globalThis.gameManager = globalThis.CustomEvent = undefined;
    });
});

describe('[Game] gameManager is instanciable and runnable with events', ()=>{
    beforeEach(()=>{
        global.window= new JSDOM(HTML,{url:'http://localhost',runScripts:"dangerously"}).window;
        global.CustomEvent = window.CustomEvent
        new Game();

    });

    afterEach(()=>{
        globalThis.gameManager = undefined;
        window.close(); // remove any eventlistener
        global.CustomEvent = undefined;
        global.window = undefined;
    });


    it('initiate good events to manage initialisation',()=>{
        class GoodGameInterface  { 
            getGameName () {return 'QOG'};
            boards () {};
            setUp () {}
        }
        const GameCreation = new CustomEvent('GameCreation',{
            detail :{
            'gameInterface': GoodGameInterface
            }
        });
        let boardSpy = sinon.spy(GoodGameInterface.prototype,"boards");
        window.dispatchEvent(GameCreation);
        
        expect(boardSpy.calledOnce).to.true;
    });

});

describe ('[Game] game Manager manage external ressources loading', ()=>{
    it('manage xhr loading with promise',async ()=>{
        const window= new JSDOM(HTML,{url:'http://localhost'}).window;
        window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        globalThis.window=window;
        globalThis.XMLHttpRequest = window.XMLHttpRequest;
        let opts={'url':'/ScenarioTest.json'};
        var request = [];
        XMLHttpRequest.onCreate = (XHR) => {
            request.push(XHR);
        }
        
        new Game();
        var result;

        expect(()=>{ gameManager.loadExternalRessources()}).to.throw('ERROR no ressource descriptor provided');
        expect(()=>{ gameManager.loadExternalRessources(opts)}).to.not.throw();
        expect(request.length).to.equal(1);
        request.pop();

        gameManager.loadExternalRessources(opts).then((data)=>{
            expect(request[0].url).to.equal('/ScenarioTest.json');
            expect(data).to.equal("test2");
        });
        request[0].respond(200,{ "Content-Type": "text/html" },"test2");
        request.pop();

        gameManager.loadExternalRessources(opts).then(()=>{expect.fail()}).catch((data)=>{
            expect(data).to.equal("ERROR");
        });
        request[0].respond(404,{ "Content-Type": "text/html" },"ERROR");

        XMLHttpRequest.restore();
        globalThis.window = undefined;
        
    });
});