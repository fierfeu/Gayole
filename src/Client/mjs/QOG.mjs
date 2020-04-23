import eventStorageInterface from '/eventStorageInterface.mjs';
import eventManager from '/eventManager.mjs';

export default class QOG {
    constructor (storage) {
        this.storage=storage;
    }

    create (window,user) {
        this.storage.setItem('gameLaunched','QOG');
        if(user) {
            this.storage.setItem('user','user');
        }
        this.myEventStorageInterface = new eventStorageInterface(window,'localStorage');
    }

}