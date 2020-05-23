'use strict'
const path = require('path');
const fs = require ('fs');
const {JSDOM} = require('jsdom');
const expect = require('chai').expect

describe ('[QOG_Head.js] is well loaded', ()=>{
    it('script tag has the good src location and is in head tag' , (done)=>{
        let FilePath = path.resolve (__dirname + '../../../..').toString()+'/src/Client/html/index.html';
        const content = fs.readFileSync(FilePath);
        const window = new JSDOM (content, {url : 'http://localhost/'}).window;
        const headScripts = window.document.getElementsByTagName('head').item(0).getElementsByTagName('script');
        expect(headScripts.length).to.equal(1);
        expect(headScripts.item(0).src).to.equal('http://localhost/QOG_Head.js');
        done();
    });
} );
