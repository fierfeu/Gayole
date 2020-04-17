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

describe ('[QOG_Head.js] is available with good initialisation', ()=>{
    let window;
    let document;

    before (()=> {
        let localPath = path.resolve (__dirname + '../../../..');
        localPath = 'file://'+localPath.toString();
        const content = '<html><head><script src ="'+localPath+'/src/Client/js/QOG_Head.js"></script></head><body></body></html>'
        const dom = new JSDOM (content,
            {
                url : 'http://localhost',
                runScripts: "dangerously",
                resources: "usable"
            }
        );
        window = dom.window;
        document = window.document;
    });

    it ('must initiate the user value and Game status in storage', (done)=>{
        //  why done doesn't worked well in before in order to wait for load event in before ?
        document.addEventListener('load',()=>{
            expect (window.localStorage.getItem('user')).to.equal('null');
            expect (window.localStorage.getItem('gameLaunched')).to.equal('false');
            done();        
        });
            
    });

});