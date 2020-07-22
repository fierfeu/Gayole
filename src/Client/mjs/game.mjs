export default class Game {
    #sequence
    #eventStorageInterface
    constructor () {
        if(globalThis.gameManager) throw('ERROR gameManager singleton allready created');
        globalThis.gameManager = this;
        this.#sequence =['boards','setUp','run']
        this.currentGame = {};
    }

    getSequence () {
        return this.#sequence;
    }

    create(gameInterface) {
        if(!(typeof gameInterface === 'function')) throw ('ERROR Bad Game interface provided : expect a class constructor and received a '+typeof gameInterface);
        if(!gameInterface.prototype[this.#sequence[0]]) throw ('ERROR BAD Game interface in '+ gameInterface.name+' : '+this.#sequence[0]+' not available');
        if (!(typeof gameInterface.prototype[this.#sequence[0]] === 'function')) throw ('ERROR BAD Game interface in '+ gameInterface.name+' : '+this.#sequence[0]+' is not a function');
            gameInterface.prototype[this.#sequence[0]].call(this);
            
        if(!gameInterface.prototype[this.#sequence[1]]) throw ('ERROR BAD Game interface in '+ gameInterface.name+' : '+this.#sequence[1]+' not available');

        if(gameInterface.prototype.getGameName) this.currentGame.name= gameInterface.prototype.getGameName();

        if (window) window.localStorage.setItem('gameLaunched','QOG');
    }


}