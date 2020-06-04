
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('CanaryTest for end to end tests', () => {

    it('must be true when it is true to verify webdriver', ()=>{
        expect(browser.executeScript('return true')).to.eventually.true;
    });

    it('canary test for Gayole site access', async () => {
        await browser.get(browser.baseUrl);
        expect(browser.getTitle()).to.eventually.equal('Gayole');
    });

});