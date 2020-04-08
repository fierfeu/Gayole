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

    it('main Menu return back to minified state when clicked',()=>{
        $('#mainMenu').click();
        expect($('#mainMenu').getAttribute('class')).to.eventually.equal('minifiedMainMenu');
    });
});

describe('[main Menu] button behavior verification', () => {
    it('game saving button is unavailable at launch', () => {
        if ($('#mainMenu').getAttribute('class') == 'minifiedMainMenu') {
            $('#mainMenu').click();
        }
        const buttonSave = $('.buttonList').all(by.tagName('button')).last();
        expect (buttonSave.getCssValue('cursor')).to.eventually.equal('not-allowed');
        expect (buttonSave.getCssValue('opacity')).to.eventually.equal('0.5');
    });
});