'use strict'

export default class QOG {
    constructor (storage) {
        this.storage=storage;
    }

    create (user) {
        this.storage.setItem('gameLaunched','QOG');
        if(user) {
            this.storage.setItem('user','user');
        }
        this.storage.setItem('gameEventStored','{event : QOG CREATION PROCESS LAUNCH}');
    }

}