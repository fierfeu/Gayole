'use strict'

import Menu from '../../../src/Client/mjs/menu.mjs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from "jsdom";
const { JSDOM } = jsdom;

describe("[Class Menu] A class menu is availabale", ()=>{
    let document;
    let menuDiv;

    before(()=>{
        const dom = new JSDOM('<!DOCTYPE html><body></body>');
        document = dom.window.document;
        menuDiv = document.createElement('div');
        menuDiv.setAttribute('id','test');
        document.body.appendChild(menuDiv);
    });

    it('is possible to instanciate a menu', ()=>{     
        expect(new Menu({'id':'test'})).to.be.an.instanceof(Menu);
        // eh oui n'importe quel objet avec un id suffit ...
    });

    it('is possible to instanciate a menu with an HTMLElement with an Id',()=>{

        let myMenu = new Menu(document.getElementById(menuDiv.id));
        expect(myMenu.Id).to.equal(menuDiv.id);
        expect(myMenu.menuState).to.equal(0);//MINIFIED
    });

    it("is possible to instanciate with an HTMLElement and a MINIFIED css class",()=>{
        let myMenu = new Menu(document.getElementById(menuDiv.id),'MINIFIEDClassName');
        expect(myMenu.currentClass).to.equal('MINIFIEDClassName');
        expect(document.getElementById(menuDiv.id).className).to.equal('MINIFIEDClassName');
    });

    it("is possible to instanciate with an HTMLElement, a MINIFIED and a MAXIFIED css class and toggle between both",()=>{
        let myMenu = new Menu(document.getElementById(menuDiv.id),'MINIFIEDClassName','MAXIFIEDClassName');
        expect(myMenu.currentClass).to.equal('MINIFIEDClassName');
        myMenu.toggle();
        expect(myMenu.currentClass).to.equal('MAXIFIEDClassName');
        expect(document.getElementById(menuDiv.id).className).to.equal('MINIFIEDClassName MAXIFIEDClassName');
        myMenu.toggle();
        expect(myMenu.currentClass).to.equal('MINIFIEDClassName');
        expect(document.getElementById(menuDiv.id).className).to.equal('MINIFIEDClassName');
    });

    it("is not possible to toggle without two css classes",()=>{
        let myMenu1 = new Menu(document.getElementById(menuDiv.id),'MINIFIEDClassName');
        expect(()=>{myMenu1.toggle()}).to.throw('!Not enought className defined for this menu to let you toggle');
        let myMenu0 = new Menu(document.getElementById(menuDiv.id));
        expect(()=>{myMenu0.toggle()}).to.throw('!Not enought className defined for this menu to let you toggle');
    });
});