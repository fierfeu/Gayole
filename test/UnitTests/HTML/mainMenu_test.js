'use strict'

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const chai = require('chai');
var expect = chai.expect;

describe('[mainMenu HTML Tests] mainMenu of index.html is well defined',()=>{

    it('mainMenu exist in index.html',()=>{
        return JSDOM.fromFile('src/Client/html/index.html').then(dom =>{
            const document = dom.window.document;
            expect(document.getElementById('mainMenu')).to.exist;
        });
    });

    it('mainMenu is made of 2 div : entete and buttonList',()=>{
        return JSDOM.fromFile('src/Client/html/index.html').then(dom =>{
            const myDocument = dom.window.document;
            const mainMenu = myDocument.getElementById('mainMenu');
        });
        
        /*expect(mainMenu.getElementsByTagName('div').length).to.equal(8); 
            const entete= dom.window.document.getElementById('entete');
            expect(entete.parentNode.id).to.equal('mainMenu');  
            const buttonList = dom.window.document.getElementById('vredse');
            expect(buttonList.parentNode.id).to.equal('mainMenu');*/
    });     
});
