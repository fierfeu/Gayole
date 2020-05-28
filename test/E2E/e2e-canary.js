const { Builder, By, Key, until } = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const web = require('../../src/Servers/App/index.js');

describe('CanaryTest', () => {

    const driver = new Builder().forBrowser('chrome').build();

    before(()=>{
        // services.run();
        process.env.HOST='localhost';
        process.env.PORT=80;

        console.log('creation with host='+ process.env.HOST +' & PORT = '+ process.env.PORT);

        web.run(process.env.HOST,process.env.PORT);

        console.log ('app launched on port '+ process.env.PORT)
        
    });

 

    it('Site title is Gayole', async () => {
        await driver.get('http://localhost');
        expect(driver.getTitle()).to.eventually.equal('Gayole');
    });

    after(async () => {
        driver.quit();
        web.stop();
    });
});