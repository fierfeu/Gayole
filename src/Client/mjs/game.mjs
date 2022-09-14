
export default class Game {

    #sequence
    constructor () {
        if(globalThis.gameManager) throw('ERROR gameManager singleton allready created');
        globalThis.gameManager = this;
        //this.#sequence =['boards','setUp','run'] to repare bug #37
        this.#sequence =['boards','setUp']; // #37 bug to remove run call by game 
        this.currentGame = {};
        this.currentScenario=[];
        window.addEventListener('GameCreation',(ev)=>{this.create(ev)});
        this.currentGame.i18n={"lang":['en','fr']};
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
        return this.sequence;
    }

    create(gameInterface) {
        if(gameInterface instanceof CustomEvent) 
            this.currentGame.gameInterface=gameInterface.detail.gameInterface;
        else if(!(typeof gameInterface === 'function')) 
            throw ('ERROR Bad Game interface provided : expect a class constructor and received a '+typeof gameInterface);
        else this.currentGame.gameInterface = gameInterface;
        if(this.currentGame.gameInterface.prototype.hasOwnProperty('getGameName')) 
            this.currentGame.name= this.currentGame.gameInterface.prototype.getGameName();
        else throw ('ERROR BAD Game interface is Empty');
        for( let i=0;i<this.sequence.length;i++) {
            if(!this.currentGame.gameInterface.prototype[this.sequence[i]]) 
                throw ('ERROR BAD Game interface in '+ this.currentGame.gameInterface.name+' : '+this.sequence[i]+' not available');
            if (!(typeof this.currentGame.gameInterface.prototype[this.sequence[i]] === 'function'))
                 throw ('ERROR BAD Game interface in '+ this.currentGame.gameInterface.name+' : '+this.sequence[i]+' is not a function');
        }
        // create game events
        window.addEventListener('GameInit',this.initialise);
        window.addEventListener('GameRunning',this.runner);

    };

    initialise () {
        for(let i=0;i<gameManager.sequence.length;i++) {
            gameManager.currentGame.gameInterface.prototype[gameManager.sequence[i]].call(gameManager);
        }   
    }

    runner () {
        gameManager.currentGame.gameInterface.prototype.run.call(gameManager)
    }

};