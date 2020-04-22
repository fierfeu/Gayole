'use strict'

import eventStorageInterface from "../../../src/Client/mjs/eventStorageInterface.mjs";

import chai from 'chai';
const expect = chai.expect;

import jsdom from 'jsdom';
const {JSDOM} = jsdom;

import fs from 'fs';

describe ("[eventStorageInterface] Constructor is available", ()=>{
    it("is possible to instanciate with 1 storageName string and/or 1 json option to define how to store",()=>{
        expect(()=>{new eventStorageInterface()}).to.throw();
        expect(()=>{new eventStorageInterface(true)}).to.throw();
        expect(()=>{new eventStorageInterface({local:true})}).to.throw();
        expect (() => {new eventStorageInterface('myName')}).to.throw();
        expect (() => {new eventStorageInterface('myName', {local:true})}).to.throw();
        expect (() => {new eventStorageInterface('myName', {local:false})}).to.throw();
        const myWindow = new JSDOM ('<body></body>', { url : 'http://localhost/'}).window;
        expect (() => {new eventStorageInterface(myWindow,'localStorage', {local:true})}).to.not.throw();
        expect (() => {new eventStorageInterface(myWindow,'sessionStorage')}).to.not.throw();
        expect (() => {new eventStorageInterface(myWindow)}).to.throw();
        expect (() => {new eventStorageInterface(myWindow,'myName', {local:false})}).to.not.throw();
        expect (() => {new eventStorageInterface(myWindow.document,'myName', {local:false})}).to.not.throw();
        
    })

    it('is possible to instanciate local storage interface with 1 context, 1 storageName and/OR 1 option', () =>{
        const myWindow = new JSDOM ('<body></body>', { url : 'http://localhost/'}).window;
        const myEventStorageInterface = new eventStorageInterface(myWindow, 'localStorage');
        expect (myEventStorageInterface.storage).to.equal(myWindow.localStorage);
        expect (myEventStorageInterface.local).to.be.true;
        const myOptionizeEventStorageInterface = new eventStorageInterface(myWindow, 'localStorage', {local:true});
        expect (myOptionizeEventStorageInterface.storage).to.equal(myWindow.localStorage);
        expect (myOptionizeEventStorageInterface.local).to.be.true;
        const myOptionizeFalseEventStorageInterface = new eventStorageInterface(myWindow.document, 'externalStorage', {local:false});
        expect (myOptionizeFalseEventStorageInterface.storage).to.equal('externalStorage');
        expect (myOptionizeFalseEventStorageInterface.local).to.be.false;
    });

    it('has created the good link to local storage after instanciation',()=>{
        const myWindow = new JSDOM ('<body></body>', { url : 'http://localhost/'}).window;
        const myEventStorageInterface = new eventStorageInterface(myWindow, 'localStorage');
        expect (myWindow.localStorage.getItem('eventsStorageQueue')).to.not.be.null;
        expect(myWindow.localStorage.getItem('eventsStorageQueue')).to.equal('DONE:eventStorageInterface init');
        const mySessionEventStorageInterface = new eventStorageInterface(myWindow, 'sessionStorage');
        expect (myWindow.sessionStorage.getItem('eventsStorageQueue')).to.not.be.null;
        expect(myWindow.sessionStorage.getItem('eventsStorageQueue')).to.equal('DONE:eventStorageInterface init');
    });

    // TODO external storage definition and test
});

describe ("[eventStorageInterface] Interface allow to prform CRUD operation", ()=>{
    it("Allow to store an event", ()=>{
        const myWindow = new JSDOM ('<body></body>', { url : 'http://localhost/'}).window;
        const myEventStorageInterface = new eventStorageInterface(myWindow, 'localStorage');
        const eventString = "EVENT:To be stored";
        myEventStorageInterface.add(eventString);
        expect(myWindow.localStorage.getItem('eventsStorageQueue')).to.equal("DONE:eventStorageInterface init,"+eventString);
    });

   it ("Allow to read last event stored",()=>{
        const myWindow = new JSDOM ('<body></body>', { url : 'http://localhost/'}).window;
        const myEventStorageInterface = new eventStorageInterface(myWindow, 'localStorage');
        expect(myEventStorageInterface.last()).to.equal("DONE:eventStorageInterface init");
        const eventString = "EVENT:To be stored";
        myEventStorageInterface.add(eventString);
        expect(myEventStorageInterface.last()).to.equal("EVENT:To be stored");
    });

    it ("Allow to read all events stored", ()=>{
        const myWindow = new JSDOM ('<body></body>', { url : 'http://localhost/'}).window;
        const myEventStorageInterface = new eventStorageInterface(myWindow, 'localStorage');
        let verifArray = new Array();
        verifArray.push ("DONE:eventStorageInterface init");
        expect(myEventStorageInterface.all()).to.be.an('array');
        expect(myEventStorageInterface.all()).to.deep.equal(verifArray);
        verifArray.push ("EVENT:To be stored");
        myEventStorageInterface.add(verifArray[1]);
        expect(myEventStorageInterface.all().length).to.equal(2);
        expect(myEventStorageInterface.all()).to.deep.equal(verifArray);
    });
});