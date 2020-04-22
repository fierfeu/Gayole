'use strict'

import eventManager from '../../../src/Client/mjs/eventManager.mjs';
import eventStorageInterface from '../../../src/Client/mjs/eventStorageInterface.mjs';

import chai from 'chai';
const expect = chai.expect;

import sinon from 'sinon';

describe ('[eventManager] is instanciable with an eventStorageInterface',()=>{
    let myInterface;
    before( () => {
        myInterface = sinon.createStubInstance(eventStorageInterface);
    });

    it('is not allowed to instanciate a manager without an interface', ()=>{
        expect(()=>{new eventManager()}).to.throw();
        expect(()=>{new eventManager('string')}).to.throw();
        const myObject = new Object();
        expect(()=>{new eventManager(myObject)}).to.throw();
        expect(()=>{new eventManager(myInterface)}).to.not.throw();
    });

    it('has instanciate the action board and handler fonction',()=>{
        const myEventManager = new eventManager(myInterface);
        expect (myEventManager.actionsBoard).to.be.an('array');
        expect (myEventManager.handler).to.not.undefined;
    });
});

describe ('[eventManager] allow to add action to manage by handler',()=>{
    let myInterface;
    before( () => {
        myInterface = sinon.createStubInstance(eventStorageInterface);
    });

    it('is possible to add new action to link with events',()=>{
        const myEventManager = new eventManager(myInterface);
        myEventManager.addAction ('CODE',()=>{});
        expect (myEventManager.actionsBoard['CODE']).to.be.an('function');
        expect (myEventManager.actionsBoard['CODE'].toString()).to.equal('()=>{}');
    });

    it('is possible to verify that an action is allready declared',()=>{
        const myEventManager = new eventManager(myInterface);
        myEventManager.addAction ('CODE',()=>{});
        expect(myEventManager.isDeclared('CODE')).to.be.true;
        expect(myEventManager.isDeclared('NOCODE')).to.be.false;
    });
});

describe ('[eventManager] handler allow to manage actions declared',()=>{
    let myInterface;
    before( () => {
        myInterface = sinon.createStubInstance(eventStorageInterface);
    });

    it('recognize declared actions in storage and throw error if not declared',()=>{
        myInterface.last = ()=>{return 'EVENT:CODE'};
        var store = new Array();
        myInterface.add = (string)=>{store.push(string)};
        const myEventManager = new eventManager(myInterface);
        myEventManager.addAction ('CODE',(storeInterface)=>{storeInterface.add('DONE:CODE');});
        expect(myEventManager.isDeclared('CODE')).to.be.true;
        myEventManager.handler();
        expect(store[0]).to.equal('DONE:CODE');
        myInterface.last = ()=>{return 'EVENT:NOCODE'};
        expect(()=>{myEventManager.handler();}).to.throw();
    });

});