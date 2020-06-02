'use stirct'

const chai = require("chai");
const expect = chai.expect;
// I don't use chai-as-promise due to : UnhandledPromiseRejectionWarning: AssertionError: expected 'btn-enabled' to equal '-enabled'
// for the same reason I won't use the thenable of promise

const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

describe('[Main Page overall Tests]',()=>{
    let browser;
    before(()=>{
        browser = new Builder().forBrowser('chrome').//how to put chromeOptions:{
            //args: ['--headless','--no-sandbox',"--disable-gpu"] like with protractor
        build();
        const host = (process.env.HOST || 'localhost');
        const port = (process.env.PORT ||80);
        browser.baseUrl = "http://"+host+":"+port;

        console.log('Server creation with host='+ host +' & PORT = '+ port);
        web.run(host,port);
    });

    after (()=>{
        web.stop();
    });

    describe('Page content is correctly rendered',  ()=>{
        before (async ()=>{
            await browser.get( browser.baseUrl);
        });

        it('and has good link to load index.css', async ()=>{
            let cssLink = await browser.findElement(By.tagName('link'));
            expect(await cssLink.getAttribute('href')).to.include('/index.css');
            
        });

        it('has good script links and async to load main js', async ()=>{
            let jsScript = await browser.findElement(By.tagName('script'));
            expect(await jsScript.getAttribute('src')).to.include('/QOG_Head.js');
            expect(await jsScript.getAttribute('async')).to.equal('true');
            expect(await jsScript.getAttribute('type')).to.equal('module');
            
        }),
    
        it ('and has good body background', async ()=>{
            let gayoleBody = await browser.findElement(By.css('body'));
            expect(await gayoleBody.getCssValue ('background-image')).to.include('QuiOseGagneFE.jpg');
            
        });
    
        it('and has a main menu available and expandable',async ()=>{
            let mainMenu = browser.findElement(By.css('#mainMenu'));
            expect(await mainMenu.getTagName()).to.equal('div');
            // if I use promise in the following line, it'll resolved after the click()
            expect(await mainMenu.getAttribute('class')).to.equal('minifiedMainMenu');
            await mainMenu.click();
            expect(await mainMenu.getAttribute('class')).to.equal('minifiedMainMenu maxifiedMainMenu');
            await mainMenu.click();
            expect(await mainMenu.getAttribute('class')).to.equal('minifiedMainMenu');
        });

        it('game saving button is unavailable if no game launched', async () => {
            const gameLaunched = await browser.executeScript("return window.localStorage.getItem('gameLaunched');");
            expect(gameLaunched).to.equal('false');
            let mainMenu = browser.findElement(By.css('#mainMenu'));
            await mainMenu.click();
            const buttonList = await browser.findElement(By.css('#buttonList'));
            const buttons = await buttonList.findElements(By.tagName('button'));
            expect (buttons.length).to.equal(3); 
            //Saved button should be the third one
            expect (await buttons[2].getCssValue('cursor')).to.equal('not-allowed'); // to remove as soon
            expect (await buttons[2].getCssValue('opacity')).to.equal('0.5'); // as css rule is unitested
            expect(await buttons[1].getAttribute('class')).to.equal('btn-disabled');
        });
    
        it('game loading button is unavailable for the moment', async () => {
            const buttonList = await browser.findElement(By.css('#buttonList'));
            const buttons = await buttonList.findElements(By.tagName('button'));
            //Laoding button should be the second one and is unavailable until user management added
            expect (await buttons[1].getCssValue('cursor')).to.equal('not-allowed');
            expect (await buttons[1].getCssValue('opacity')).to.equal('0.5');
            expect(await buttons[1].getAttribute('class')).to.equal('btn-disabled');
        });

        it('game creation button available and in first place', async ()=>{
            const buttonList = await browser.findElement(By.css('#buttonList'));
            const buttons = await buttonList.findElements(By.tagName('button'));
            //create button is the first one
            expect(await buttons[0].getText()).to.equal('CREER NOUVELLE PARTIE');
            expect(await buttons[0].getAttribute('class')).to.equal('btn-enabled');
        });

        after (async ()=>{
            await browser.quit();
        });
    });
});