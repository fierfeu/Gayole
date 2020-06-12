'use strict'
const chai = require('chai');
var expect=chai.expect;
const fs = require('fs');
const res = require('../App/responseFake.js');
const Handler = require ('../../../src/Servers/App/webHandler.js');
const {JSDOM} = require ('jsdom');

describe('[CSS TESTS] index.css existe and stored at the good place',()=>{

    it('index.css is well stored and available',()=>{
        
        expect(() => {fs.accessSync('src/Client/css/index.css')}).to.not.throw();
    })

    it('Webhandler knows the route to index.css', () =>{
        let response = new res();

        const request = {
            url : '/index.css'
        };

        Handler.handler(request,response);

        expect (response.statusCode).to.equal(200);
    });
});

describe('[CSS TESTS] index.css has minifiedMainMenu and maxifiedMainMenu classes',()=>{
    let cssFile,indexSheet;
    before(()=>{
        cssFile = fs.readFileSync('src/Client/css/index.css','utf8');
        const HTML = "<!doctype html><html><head><style>" + cssFile 
            +"</style></head><body></body></html>";
        const window = new JSDOM(HTML,{pretendToBeVisual: true}).window;
        const styles = window.document.getElementsByTagName('style');
        indexSheet = styles[0].sheet.cssRules;
    })
    it('index.css declare minifiedMainMenu and maxifiedMainMenu',()=>{
            expect (cssFile).to.include('.minifiedMainMenu');
            expect (cssFile).to.include('.maxifiedMainMenu');
    });

    it('index.css declare basic rules and classes for game',()=>{
        expect (cssFile).to.include ('body {');
        expect (cssFile).to.include ('.unit');
        expect (cssFile).to.include ('#mainMenu {');
        expect (cssFile).to.include ('#buttonList');
        expect (cssFile).to.include ('.btn-enabled');
        expect (cssFile).to.include ('.btn-enabled:active');
        expect (cssFile).to.include ('.btn-disabled');
        expect (cssFile).to.include ('#entete');
        expect (cssFile).to.include ('#buttonList');
        expect (cssFile).to.include ('#gameBoard');
    })

    it('body rules are well coded',()=>{
        let bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === 'body') bodyIndex = index;
        });
        expect (bodyIndex,'we must have a "body" selector').to.not.be.null;
        expect (indexSheet[bodyIndex].style['background-image']).to.equal("url('/QuiOseGagneFE.png')");
        expect (indexSheet[bodyIndex].style['background-repeat']).to.equal("no-repeat");
        expect (indexSheet[bodyIndex].style['background-size']).to.equal("cover");
        //getComputedStyle ... just to remember
    })

    it('unit rules are well coded',()=>{
        let bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '.unit') bodyIndex = index;
        });
        expect (bodyIndex,'we must have a ".unit" selector').to.not.be.null;
        expect (indexSheet[bodyIndex].style['position']).to.equal("absolute");
        expect (indexSheet[bodyIndex].style['width']).to.equal("30px");
        expect (indexSheet[bodyIndex].style['height']).to.equal("30px");
        expect (indexSheet[bodyIndex].style['box-shadow']).to.equal("2px 2px darkGoldenRod");
    });

    it('MainMenu rules are well coded',()=>{
        //title of the button interface (where is the create button)
        let bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '#entete') bodyIndex = index;
        });
        // we had allready verify that this rule exist
        expect (indexSheet[bodyIndex].style['justify-content']).to.equal("space-between");
        expect (indexSheet[bodyIndex].style['background-color']).to.equal("rgba(247, 134, 41, 1)");
        expect (indexSheet[bodyIndex].style['align-items']).to.equal("center");

        //to be sure that menu is always above map
        bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '.maxifiedMainMenu') bodyIndex = index;
        });
        expect (indexSheet[bodyIndex].style['z-index']).to.equal("10");

        //to be sure that font is well declared
        bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.type === 5) bodyIndex = index; //usefull if only one font face declaration
        });
        expect (indexSheet[bodyIndex].style['font-family']).to.equal("mainMenuTitleFont");
        expect (indexSheet[bodyIndex].style['src']).to.equal("url('/mainMenuTitle.ttf')format('truetype')");

    });

    it('GameBoard has good rules for border and size',()=>{
        // find #GameBoard index
        let bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '#gameBoard') bodyIndex = index;
        });
        expect (indexSheet[bodyIndex].style['border-style']).to.equal('solid'); // for chrome as firefox doesn't care
        expect (indexSheet[bodyIndex].style['border-image-source']).to.equal("url('/strategicBorder.png')");
        expect (indexSheet[bodyIndex].style['border-image-slice']).to.equal('30 25 34 25');
        expect (indexSheet[bodyIndex].style['border-image-repeat']).to.equal('round');
        expect (indexSheet[bodyIndex].style['border-image-width']).to.equal('15px');
        expect (indexSheet[bodyIndex].style['border-image-outset']).to.equal('13px');
        expect (indexSheet[bodyIndex].style['position']).to.equal('absolute');
        expect (indexSheet[bodyIndex].style['top']).to.equal('18px');
        expect (indexSheet[bodyIndex].style['left']).to.equal('58px');
        bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '.strategicMap') bodyIndex = index;
        });
        expect (indexSheet[bodyIndex].style['border-style']).to.equal('solid'); // for chrome as firefox doesn't care
        expect (indexSheet[bodyIndex].style['border-image-source']).to.equal("url('/strategicBorder.png')");
        expect (indexSheet[bodyIndex].style['border-image-slice']).to.equal('30 0 0 0');
        expect (indexSheet[bodyIndex].style['border-image-repeat']).to.equal('round');
        expect (indexSheet[bodyIndex].style['border-image-width']).to.equal('10px 10px 0 10.5px');
        expect (indexSheet[bodyIndex].style['border-image-outset']).to.equal('10px');
        expect (indexSheet[bodyIndex].style['padding']).to.equal('0');
        expect (indexSheet[bodyIndex].style['width']).to.equal('1180px');
        expect (indexSheet[bodyIndex].style['height']).to.equal('623px');
        expect (indexSheet[bodyIndex].style['position']).to.equal('relative'); // to be sure that isthe nearest ancestor of units
    });
});