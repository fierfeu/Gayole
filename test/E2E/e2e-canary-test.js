'use strict'

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('e2e canary test', () => {
    it('must be true when it is true', (done)=>{
        expect(browser.executeScript('return true')).to.eventually.true;
        done();
    });
});
