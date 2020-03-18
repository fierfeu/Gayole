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

describe ('[Index.html] index content is correctly rendered', ()=>{
    beforeEach (()=>{
        browser.get(browser.baseUrl);
    });
    it('and has good link to load index.css', ()=>{
        expect(element(by.tagName('link')).getAttribute('href')).to.eventually.include('/index.css');
    });

    it ('and has good body background', ()=>{
        expect($('body').getCssValue ('background-image')).to.eventually.include('QuiOseGagneFE.jpg');
    });
});