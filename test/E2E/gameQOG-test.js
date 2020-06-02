'use stirct'

const chai = require("chai");
const expect = chai.expect;

const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

describe('[QOG Game user Tests]',()=>{
    let browser;
    before(async ()=>{
        browser = new Builder().forBrowser('chrome').//how to put chromeOptions:{
            //args: ['--headless','--no-sandbox',"--disable-gpu"] like with protractor
        build();
        const host = (process.env.HOST || 'localhost');
        const port = (process.env.PORT ||80);
        browser.baseUrl = "http://"+host+":"+port;

        web.run(host,port);
        console.log('Server creation with host='+ host +' & PORT = '+ port);
        await browser.get( browser.baseUrl);
    });

    describe ('Game creation sequence',()=>{
        const alertText = 'Scenario par défaut : Default Scenario';
        before (async ()=>{
            const mainMenu = await browser.findElement(By.css('#mainMenu'));
            await mainMenu.click();
        });

        it('Game creation button behavior verification',async ()=>{
            const buttons = await browser.findElement(By.css('#buttonList')).findElements(By.tagName('button'));
            await buttons[0].click();
            await browser.wait(until.alertIsPresent());
            let alert = await browser.switchTo().alert();
            expect(await alert.getText()).to.equal(alertText);
            await alert.accept();
            const gameLaunched = await browser.executeScript("return window.localStorage.getItem('gameLaunched');");
            expect(gameLaunched).to.equal('QOG');
        });

    });

    describe ('Game usages sequences',()=>{
        
        before (async ()=>{
            await browser.get( browser.baseUrl); // to put context at the real begining
            const mainMenu = await browser.findElement(By.css('#mainMenu'));
            await mainMenu.click();
        });

        it('unit drag and drop',async ()=>{
            const buttons = await browser.findElement(By.css('#buttonList')).findElements(By.tagName('button'));
            await buttons[0].click();
            await browser.wait(until.alertIsPresent());
            await browser.switchTo().alert().accept();
            
            await browser.wait(until.elementLocated(By.css('.unit')),4000);
            
            const zone2place = await browser.findElement(By.id('Cross1'));
            const unit2move = await browser.findElement(By.name("1st Patrol"));

            await browser.actions({bridge:true}).dragAndDrop(unit2move,{x:-5,y:-100}).perform();

            expect(await unit2move.getRect()).to.include({x:740,y:529});
        });

    });

    after ( async ()=>{
        await browser.quit();
        web.stop();
    });
    
});