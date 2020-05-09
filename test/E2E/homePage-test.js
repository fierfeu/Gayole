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
    before (()=>{
        //browser.get(browser.baseUrl);
        browser.get(browser.baseUrl).catch(function () {

            return browser.switchTo().alert().then(function (alert) {
        
              alert.accept();
              return browser.get(browser.baseUrl);
        
            });
          });
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

    it('main Menu return back to minified state when clicked',()=>{
        $('#mainMenu').click();
        expect($('#mainMenu').getAttribute('class')).to.eventually.equal('minifiedMainMenu');
    });
});

describe('[main Menu] button behavior verification', () => {

    it('game saving button is unavailable at launch', () => {
        const gameLaunched = browser.executeScript("return window.localStorage.getItem('gameLaunched');");
        expect(gameLaunched).to.eventually.equal('false');
        const buttonSave = $('#buttonList').all(by.tagName('button')).last();
        expect (buttonSave.getCssValue('cursor')).to.eventually.equal('not-allowed');
        expect (buttonSave.getCssValue('opacity')).to.eventually.equal('0.5');
    });

    it('Game creation button behavior verification', () => {
        
        $('#mainMenu').click();
        let buttons = $$('.btn-enabled');
        expect(buttons.get(0).getText()).to.eventually.equal('CREER NOUVELLE PARTIE');
        buttons.get(0).click().then(()=>{browser.switchTo().alert().accept();});
        expect($('#mainMenu').getAttribute('class')).to.eventually.equal('minifiedMainMenu');
        const gameLaunched = browser.executeScript("return window.localStorage.getItem('gameLaunched');");
        expect(gameLaunched).to.eventually.equal('QOG');
        const gameEventStored = browser.executeScript("return window.localStorage.getItem('eventsStorageQueue');");
        expect(gameEventStored).to.eventually.equal('DONE:eventStorageInterface init');
    });

    //TODO tester que le troisième boutton est maintenant clickable
});