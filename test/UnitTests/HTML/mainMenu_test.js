'use strict'

const fs = require('fs');
const path = require('path');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const chai = require('chai');
var expect = chai.expect;

describe('[mainMenu HTML Tests] mainMenu of index.html is well defined in HTML',()=>{

    it('mainMenu exist in index.html and has the good className and the good parent',()=>{
        return JSDOM.fromFile('src/Client/html/index.html').then(dom =>{
            const document = dom.window.document;
            expect(document.getElementById('mainMenu')).to.exist;
            expect(document.getElementById('mainMenu').parentNode.nodeName).to.equal('BODY');
            expect(document.getElementById('mainMenu').className).to.equal('minifiedMainMenu');
        });
    });

    it('mainMenu is made of 5 div devided into entete and buttonList',()=>{
        return JSDOM.fromFile('src/Client/html/index.html').then(dom =>{
            const mainMenu = dom.window.document.getElementById('mainMenu');
            expect(mainMenu.getElementsByTagName('div').length).to.equal(5);
            const entete= dom.window.document.getElementById('entete');
            expect(entete).to.exist;
            expect(entete.parentNode.id).to.equal('mainMenu');
            const buttonList = dom.window.document.getElementById('buttonList');
            expect(buttonList).to.exist;
            expect(buttonList.parentNode.id).to.equal('mainMenu');
        });
    });    
    
    it('entete div is made of 3 divs with the second called maiMenuTitle, centered and with good className',()=>{
        return JSDOM.fromFile('src/Client/html/index.html').then(dom => {
            const entete= dom.window.document.getElementById('entete');
            const enteteDiv=entete.getElementsByTagName('div');
            expect(enteteDiv.length).to.equal(3);
            expect(enteteDiv[1].id).to.equal('mainMenuTitle');
            // to center the mainMenuTitle the third div must be width=2%
            expect(enteteDiv[2].style.width).to.equal('2%');
            expect(enteteDiv[1].className).to.equal('warLetters');
        });
    });

    it('buttonList div is made of 3 buttons with good height and width and the third one is unavailable by default',()=>{
        return JSDOM.fromFile('src/Client/html/index.html').then(dom => {
            const buttonList = dom.window.document.getElementById('buttonList');
            expect(buttonList.getElementsByTagName('button').length).to.equal(3);
            for(let i=0; i<3; i++){
                expect(buttonList.getElementsByTagName('button')[i].style.width).to.equal('70%','div nb='+i+' width');
                expect(buttonList.getElementsByTagName('button')[i].style.height).to.equal('20%','div nb='+i+' height');
                expect(buttonList.getElementsByTagName('button')[i].style.backgroundColor).to.equal('lightgrey','div nb='+i+' backgroundcolor');
                expect(buttonList.getElementsByTagName('button')[i].style.color).to.equal('darkslategrey','div nb='+i+' color is not darkslategrey');
            }
        });
    });
});

describe('[mainMenu] has good css definition',()=>{
    let dom;
    let window;
    let document;

    before (()=>{
        let localPath = path.resolve (__dirname + '../../../..');
        localPath = 'file://'+localPath.toString();
        const content = '<head><link rel="stylesheet" type="text/css"  href="'+localPath+'/src/Client/css/index.css"></head>'+
            "<body><div id='mainMenu' class='minifiedMainMenu'><div id='entete'></div><div id='buttonList'></div></div></body>";
        dom = new JSDOM(content,{ url : "http://localhost/", resources: "usable"});
        window = dom.window;
        document = window.document;
    });

    // keep this test in first position as it verify that css loading is achived
    // don't know yet why I was anaible to verifiy it in before fucntion
    it('minifiedMenu exist and is well defined',(done)=>{
        dom.window.document.addEventListener('load',()=>{
            let mainMenu =  document.getElementsByClassName('minifiedMainMenu')[0];
            const computdiv = window.getComputedStyle(mainMenu);
            expect(computdiv.getPropertyValue('height')).to.equal('30px');
            expect(computdiv.getPropertyValue('width')).to.equal('30px');
            expect(computdiv.getPropertyValue('background-color')).to.equal('rgba(247, 134, 41, 0.7)');
            expect(computdiv.getPropertyValue('background-image')).to.equal("url(/Hamburger_QOG_icon.png)");
            expect(computdiv.getPropertyValue('background-size')).to.equal('100%');
            expect(window.getComputedStyle(document.getElementById('entete')).getPropertyValue('display')).to.equal('none');
            expect(window.getComputedStyle(document.getElementById('buttonList')).getPropertyValue('display')).to.equal('none');
            done();
        });
    });

    it('maxifiedMainMenu exist and is well defined',()=>{
        let mainMenu = document.getElementById('mainMenu');
        mainMenu.className = 'maxifiedMainMenu';
        const ComputedMainMenu = window.getComputedStyle(mainMenu);
        expect(window.getComputedStyle(document.getElementById('entete')).getPropertyValue('display')).to.equal('flex');
        expect(window.getComputedStyle(document.getElementById('buttonList')).getPropertyValue('display')).to.equal('flex');
        expect(ComputedMainMenu.getPropertyValue('height')).to.equal('250px');
        expect(ComputedMainMenu.getPropertyValue('width')).to.equal('200px');
        expect(ComputedMainMenu.getPropertyValue('background-image')).to.equal('none');
        expect(ComputedMainMenu.getPropertyValue('border-radius')).to.equal('2%');
        
    });

    it('in mainMenu buttonList div has good css definition as a flexbox', () => {
        const buttonList = document.getElementById('buttonList');
        const computedButtonList = window.getComputedStyle(buttonList);
        // buttons en columns, centrés et répartis sur la div
        expect (computedButtonList.getPropertyValue('flex-direction')).to.equal('column');
        expect (computedButtonList.getPropertyValue('align-items')).to.equal('center');
    })
});