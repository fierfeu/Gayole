
export default class Game {

    constructor () {
        if(globalThis.gameManager) throw('ERROR gameManager singleton allready created');
        globalThis.gameManager = this;
        this.sequence =['boards','setUp']; 
        this.currentGame = {};
        this.currentScenario=[];
        this.currentGame.i18n={"lang":['en','fr']};
        window.addEventListener('GameCreation',(ev)=>{this.create(ev)});

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

    /**
     * 
     * @param {CustomEvent} gameInterface 
     * 
     * CustomEvent.detail = {gameInterface,player,gameBoardElement}
     */
    async create(gameInterface) {
        try {
            if(gameInterface === undefined) throw TypeError('ERROR no game interface specified');
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
            await this.initialise();
        } catch(error) {
            throw error
        }
        this.runner();
    };

    async initialise () {
        for(let i=0;i<gameManager.sequence.length;i++) {
            await gameManager.currentGame.gameInterface.prototype[gameManager.sequence[i]].call(gameManager);
        }   
    }

    runner () {
        const gameboard = document.getElementById('gameBoard')
        gameboard.classList.toggle('gameBoardHide')
        gameManager.currentGame.gameInterface.prototype.run.call(gameManager)
    }

};