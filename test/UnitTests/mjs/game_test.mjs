import Game from '../../../src/Client/mjs/game.mjs';

import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;

describe('[Game] game creation tests',()=>{

    const HTML = "<!doctype html><html><body></body></html>";

    it('is possible to instanciate one and only one game manager',()=>{
        globalThis.gameManager = undefined;

        expect(()=>{new Game()}).to.not.throw();
        expect (globalThis.gameManager).to.exist;
        expect (globalThis.gameManager.create).to.exist;
        expect(gameManager.getSequence).to.exist;
        
        const currentSequence = gameManager.getSequence();
        expect(currentSequence[0]).to.equal('boards');
        expect(()=>{new Game()}).to.throw(); // singleton !

        globalThis.gameManager = undefined;
    });

    it ('is possible to instanciate one game manager in a window context',()=>{
        const window= new JSDOM(HTML,{url:'http://localhost',runScripts:"dangerously"}).window;
        const gameClassString = Game.toString();
        
        window.eval(gameClassString +"new Game();");
        expect(window.eval("globalThis.gameManager")).to.exist;
        expect(window.eval("window.gameManager")).to.exist;
        expect(window.gameManager.create).to.exist;
        
    });

    it ('is possible to create a new game instance',()=>{
        globalThis.gameManager = undefined;
        const window= new JSDOM(HTML,{url:'http://localhost'}).window;
        globalThis.window = window;
        new Game();
        class Empty {}

        expect (()=>{gameManager.create()}).to.throw();
        expect(()=>{gameManager.create('TOTO')}).to.throw('ERROR Bad Game interface provided : expect a class constructor and received a string');
        expect(()=>{gameManager.create(Empty)}).to.throw('ERROR BAD Game interface in Empty');

        class BadBoards {}
        BadBoards.prototype.boards='test';
        expect(()=>{gameManager.create(BadBoards)}).to.throw('ERROR BAD Game interface in BadBoards : boards is not a function');
        class GoodBoards {boards () {}};
        expect(()=>{gameManager.create(GoodBoards)}).to.throw('ERROR BAD Game interface in GoodBoards : setUp not available');

        class GoodSetUp {setUp () {}};
        expect(()=>{gameManager.create(GoodSetUp)}).to.throw('ERROR BAD Game interface in GoodSetUp : boards not available');

        gameManager.boardsOk = false;
        class GoodGameInterface { 
            getGameName () {return 'QOG'}
            boards () {this.boardsOk=true;}
            setUp () {}
        }
        expect(()=>{gameManager.create(GoodGameInterface)}).to.not.throw();
        expect(gameManager.currentGame.name).to.equal('QOG');
        expect (gameManager.boardsOk).to.true;

        globalThis.gameManager = undefined;
    });
});