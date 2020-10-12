export default class Game {
    #sequence
    constructor () {
        if(globalThis.gameManager) throw('ERROR gameManager singleton allready created');
        globalThis.gameManager = this;
        //this.#sequence =['boards','setUp','run'] to repare bug #37
        this.#sequence =['boards','setUp']; // #37 bug to remove run call by game 
        this.currentGame = {};
        this.currentScenario=[];
    }

    loadExternalRessources (opts) {
        if(!opts) throw('ERROR no ressource descriptor provided');
        if (XMLHttpRequest) {
            var loadRequest = new XMLHttpRequest();
            
            return new Promise((resolve,reject)=>{ 
                loadRequest.open('GET', opts.url);
                loadRequest.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(loadRequest.response);
                    } else {
                        reject('ERROR');
                    }
                }
                loadRequest.send();
            });
        }
        else console.log('no XMLHttpRequest');
    }

    getSequence () {
        return this.#sequence;
    }

    create(gameInterface) {
        if(!(typeof gameInterface === 'function')) throw ('ERROR Bad Game interface provided : expect a class constructor and received a '+typeof gameInterface);
        if(gameInterface.prototype.hasOwnProperty('getGameName')) this.currentGame.name= gameInterface.prototype.getGameName();
        for(let i=0;i<this.#sequence.length;i++) {
            if(!gameInterface.prototype[this.#sequence[i]]) throw ('ERROR BAD Game interface in '+ gameInterface.name+' : '+this.#sequence[i]+' not available');
            if (!(typeof gameInterface.prototype[this.#sequence[i]] === 'function')) throw ('ERROR BAD Game interface in '+ gameInterface.name+' : '+this.#sequence[i]+' is not a function');
                gameInterface.prototype[this.#sequence[i]].call(this);
        }

    };


};