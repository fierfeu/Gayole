const { Builder, By, Key, until } = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const web = require('../../src/Servers/App/index.js');

describe('CanaryTest for end to end tests', () => {

    const browser = new Builder().forBrowser('chrome').build();
    const host = (process.env.HOST || 'localhost');
    const port = (process.env.PORT ||80);
    const baseUrl = "http://"+host+":"+port;

    before(()=>{
        
        console.log('creation with host='+ host +' & PORT = '+ port);

        web.run(host,port);
        
    });

    it('must be true when it is true to verify webdriver', (done)=>{
        expect(browser.executeScript('return true')).to.eventually.true;
        done();
    });

    it('canary test for Gayole site access', async () => {
        await browser.get(baseUrl);
        expect(browser.getTitle()).to.eventually.equal('Gayole');
    });

    after(async () => {
        browser.quit();
        web.stop();
    });
});