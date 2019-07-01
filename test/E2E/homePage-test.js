'use strict'

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe ('http://hostname/ allow acces to home page', ()=> {
    it('return Gayole Home Page when using root access',(done)=>{
        browser.get(browser.baseUrl);
        expect(browser.getTitle()).to.eventually.equal('Gayole');
        done();
    });
});