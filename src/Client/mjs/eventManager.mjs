// Must used an eventStorageInterface to work well
import eventStorageInterface from '../../../src/Client/mjs/eventStorageInterface.mjs';

export default class eventManager {
    constructor (storageInterface) {
        if (!(storageInterface instanceof eventStorageInterface))
            throw ('ERROR : storageInterface is not an isntanceof eventStorageInterface');
        this.actionsBoard = new Array();
        this.storage = storageInterface;
    }

    handler () {
        let eventString = this.storage.last();
        const eventToPlay = eventString.split(':')[1];
        console.log(this.actionsBoard);
        if (this.isDeclared(eventToPlay))
            this.actionsBoard[eventToPlay].call(this,this.storage);
        else throw ('ERROR : Unknown event code ');
    }

    addAction (code,actionFunction) {
        this.actionsBoard[code]=actionFunction;
    }

    isDeclared (code) {
        return (code in this.actionsBoard);
    }
}