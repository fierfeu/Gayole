const { Builder, By, Key, until } = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const web = require('../../src/Servers/App/index.js');

describe('CanaryTest for end to end tests', () => {

    const browserDriver = new Builder().forBrowser('chrome').build();
    const host = (process.env.HOST || 'localhost');
    const port = (process.env.PORT ||80);
    const baseUrl = "http://"+host+":"+port;

    before(()=>{
        
        console.log('creation with host='+ host +' & PORT = '+ port);

        web.run(host,port);

        console.log ('app launched on port '+ port)
        
    });

 

    it('canary test for Gayole site access', async () => {
        await browserDriver.get(baseUrl);
        expect(browserDriver.getTitle()).to.eventually.equal('Gayole');
    });

    after(async () => {
        browserDriver.quit();
        web.stop();
    });
});