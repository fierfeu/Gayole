'use strict'

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe ('http://hostname/ allow acces to home page &', ()=> {
    it('return Gayole Title',(done)=>{
        browser.get(browser.baseUrl);
        expect(browser.getTitle()).to.eventually.equal('Gayole');
        done();
    });
});

describe ('[index.html] index content is correctly rendered', ()=>{
    beforeEach (()=>{
        browser.get(browser.baseUrl);
    });
    it('and has good link to load index.css', ()=>{
        expect(element(by.tagName('link')).getAttribute('href')).to.eventually.include('/index.css');
    });

    it ('and has good body background', ()=>{
        expect($('body').getCssValue ('background-image')).to.eventually.include('QuiOseGagneFE.jpg');
    });

    it('and has a main menu available',()=>{
        expect($('#mainMenu').getTagName()).to.eventually.equal('div');
    });
});

describe('[index.html] main Menu behavior verification',()=>{
    it('main Menu is minified at launch',()=>{
        expect($('#mainMenu').getAttribute('class')).to.eventually.equal('minifiedMainMenu');
    });

    it('main Menu is maximised when I click on minified icon',()=>{
        $('#mainMenu').click();
        expect($('#mainMenu').getAttribute('class')).to.eventually.equal('minifiedMainMenu maxifiedMainMenu');
    });

    it('main Menu Maxified contain good buttons to act',()=>{
        //expect.fail('test to write');
        // TODO le menu principal doit contenir :
        //  1 bouton pour démarrer une partie
        //  1 bouton pour reprendre une partie
        //  1 bouton pour minifier le Menu
        // les boutons sont clickables et il faut donc prévoir les tests pour chaque action associées aux boutons.
    })
});