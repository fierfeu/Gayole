'use strict'

const chai = require("chai");
const expect = chai.expect;

const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

describe('[QOG Game user Tests]',()=>{

    before (async ()=>{
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
            //await browser.wait(until.alertIsPresent());
            //let alert = await browser.switchTo().alert();
            //expect(await alert.getText()).to.equal(alertText);
            //await alert.accept();
            let board = await browser.wait(until.elementLocated(By.css('#strategicMap')),10000);
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
            //await browser.wait(until.alertIsPresent());
            //await browser.switchTo().alert().accept();
            
            await browser.wait(until.elementLocated(By.css('.unit')),4000);
            
            const origine = await browser.findElement(By.id('strategicMap'));
            const zone2place = await browser.findElement(By.id('Cross1'));
            const unit2move = await browser.findElement(By.name("1st Patrol"));
            
            let coords = await zone2place.getAttribute('coords');
            coords = coords.split(',');
            let Rect = {"x":0,"y":0};
            Rect.x= Number(coords[0])+9;
            Rect.y= Number(coords[1])+63;

            await browser.actions({async:true})
                .move({origin:unit2move})
                .press()
                .move({origin:origine,x:280,y:150},1000)
                .release()
                .perform();

            expect(await unit2move.getAttribute('class')).to.include('dragged');
            //expect(await unit2move.getRect()).to.include({x:740});

            await browser.actions({bridge: true})
                .dragAndDrop(unit2move,zone2place)
                .perform();
        
            expect(await unit2move.getAttribute('class')).to.include('dragged');
            
            
        });

    });

    describe('Game dialog interface usage',()=>{
        before (async ()=>{
            await browser.get( browser.baseUrl); // to put context at the real begining
            const mainMenu = await browser.findElement(By.css('#mainMenu'));
            await mainMenu.click();
            const buttons = await browser.findElement(By.css('#buttonList')).findElements(By.tagName('button'));
            await buttons[0].click();
            await browser.findElement(By.id('dialogZone'))
        });
        it('open a dialog box when over turn number',async ()=>{
            const turn = await browser.findElement(By.id('turn'));
            await browser.actions({async:true}).move({origin: turn}).perform();
            const dialog= await browser.findElement(By.id('dialogWindow'));
            expect(dialog).to.exist;
            expect(await dialog.isDisplayed()).to.true;
            expect(await dialog.getAttribute('class')).to.not.include('gameBoardHide');
        });
        it('open a dialog window when over unit', async ()=>{
            const piece = await browser.findElement(By.name('1st Patrol'));
            await browser.actions({async:true}).move({origin: piece}).perform();
            const dialog= await browser.findElement(By.id('dialogWindow'));
            expect(await dialog.isDisplayed()).to.true;
        });
        it('hide any dialogWindow when out any unit or game data box as turn',async ()=>{
            const outOfany = await browser.findElement(By.id('dialogZone'));
            await browser.actions({async:true}).move({origin: outOfany}).perform();
            expect( await browser.findElement(By.id('dialogWindow')).isDisplayed()).to.false;
        })
    });
});