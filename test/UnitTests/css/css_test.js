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

    it('index.css declare rules for units',()=>{
        expect(cssFile).to.include('.description');
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
        expect (indexSheet[bodyIndex].style['box-shadow']).to.equal("1px 1px GoldenRod");
    });

    it('MainMenu rules are well coded',()=>{
        //title of the button interface (where is the create button)
        let bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '#entete') bodyIndex = index;
        });
        // we had allready verify that this rule exist
        expect (indexSheet[bodyIndex].style['padding-left']).to.equal("40px");
        expect (indexSheet[bodyIndex].style['height']).to.equal("32px");

        //to be sure that menu is always above map
        bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '.maxifiedMainMenu') bodyIndex = index;
        });
        expect (indexSheet[bodyIndex].style['z-index']).to.equal("80");

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
        expect (indexSheet[bodyIndex].style['margin-left']).to.equal('36px'); 
        expect (indexSheet[bodyIndex].style['z-index']).to.equal('10');
        expect (indexSheet[bodyIndex].style['height']).to.equal('718px');
        expect (indexSheet[bodyIndex].style['width']).to.equal('1186px');
        bodyIndex=null;
        indexSheet.forEach((el, index )=>{
            if(el.selectorText === '.strategicMap') bodyIndex = index;
        });
        expect (indexSheet[bodyIndex].style['margin-top']).to.equal('5px'); 
        expect (indexSheet[bodyIndex].style['padding']).to.equal('2px');
        expect (indexSheet[bodyIndex].style['width']).to.equal('1180px');
        expect (indexSheet[bodyIndex].style['height']).to.equal('623px');
        expect (indexSheet[bodyIndex].style['position']).to.equal('relative'); // to be sure that isthe nearest ancestor of units
    });
});