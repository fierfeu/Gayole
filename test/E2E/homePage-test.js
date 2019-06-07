'use strict'

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe ('http://hostname/ allow acces to home page', ()=> {
    it('return index.html when using root access',(done)=>{
        browser.get('/');
        expect(browser.getTitle()).to.be.equal('Gayole');
        done();
    });
});