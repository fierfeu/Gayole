'use strict'
const path = require('path');
const fs = require ('fs');
const {JSDOM} = require('jsdom');
const expect = require('chai').expect

describe ('[QOG_Head.js] is well loaded', ()=>{
    it('script tag has the good src location ans is in head tag' , (done)=>{
        let FilePath = path.resolve (__dirname + '../../../..').toString()+'/src/Client/html/index.html';
        const content = fs.readFileSync(FilePath);
        const document = new JSDOM (content).window.document;
        const headScripts = document.getElementsByTagName('head').item(0).getElementsByTagName('script');
        expect(headScripts.length).to.equal(1);
        expect(headScripts.item(0).src).to.equal('/QOG_Head.js');
        done();
    });
} );

