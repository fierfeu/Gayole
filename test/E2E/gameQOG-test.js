'use strict'

const chai = require("chai");
const expect = chai.expect;
const fs = require("fs")

const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

describe('[QOG Game user Tests]',()=>{

    before (async ()=>{
        await browser.get( browser.baseUrl);
        const mainMenu = await browser.findElement(By.css('#mainMenu'));
        await browser.wait(until.elementIsVisible(mainMenu),4000)
        await mainMenu.click();
        const buttons = await browser.findElements(By.css('#buttonList button'));
        await browser.wait(until.elementIsVisible(buttons[0]),4000)
        await buttons[0].click();
    });
    
    describe('Game dialog interface usage',()=>{

        it('open a dialog box when over turn number',async ()=>{
            const turn = await browser.findElement(By.id("turn"),10000);
            await browser.actions({async:false}).move({origin: turn}).perform();
            const dialog= await browser.findElement(By.id('dialogWindow'),10000);
            expect(dialog).to.exist;
            expect(await dialog.isDisplayed()).to.true;
            let image = await browser.takeScreenshot();
            fs.writeFile("./test/images/overTurnZone.png",image,{encoding:'base64'}, (err)=>{if(err!=null) console.log(err)});
            expect(await dialog.getAttribute('class')).to.not.include('gameBoardHide');
        });

        it('hide any dialogWindow when out any unit or game data box as turn',async ()=>{
            const outOfany = await browser.findElement(By.id('dialogZone'));
            await browser.actions({async:true}).move({origin: outOfany}).pause(500).perform();
            expect( await browser.findElement(By.id('dialogWindow')).isDisplayed()).to.false;
        });

        it('open a dialog window when over unit', async ()=>{
            const piece = await browser.findElement(By.name("1st Patrol"),10000);
            let image = await browser.takeScreenshot();
            fs.writeFile("./test/images/beforeOverUnit.png",image,{encoding:'base64'}, (err)=>{if(err!=null) console.log(err)});
            //await browser.wait(until.elementIsVisible(piece));
            await browser.actions({async:false}).move({origin: piece}).perform();
            image = await browser.takeScreenshot();
            fs.writeFile("./test/images/overUnit.png",image,{encoding:'base64'}, (err)=>{if(err!=null) console.log(err)});
            const dialog= await browser.findElement(By.id('dialogWindow'),6000);
            expect(await dialog.isDisplayed()).to.true;
        });
    });

    describe ('Game sequences',()=>{
        it('Game creation button behavior verification',async ()=>{
            const board = await browser.findElement(By.id('strategicMap'));
            await browser.wait(until.elementIsVisible(board),15000,"board not visible")
            const turnNbDisplay = await browser.findElement(By.id('turn'));

            await browser.wait(async ()=>{
                let turnValue = parseInt(await turnNbDisplay.findElement(By.css('span')).getText());
                return turnValue;
                }, 20000);

            const gameLaunched = await browser.executeScript("return window.localStorage.getItem('gameLaunched');");

            expect(gameLaunched).to.equal('QOG');
        });

        it('first action points are initialised',async ()=>{
            const turnNbDisplay = await browser.findElement(By.id('turn'));
            const actionPointsDisplay = await browser.findElement(By.id('PA'));
            expect (parseInt(await actionPointsDisplay.findElement(By.css('span'),10000).getAttribute('innerHTML'))).greaterThan(2);
        })
        
        it('unit drag and drop',async ()=>{

            await browser.get( browser.baseUrl); // to put context at the real begining
            const mainMenu = await browser.findElement(By.css('#mainMenu'));
            await browser.wait(until.elementIsVisible(mainMenu),4000)
            await mainMenu.click();
            const buttons = await browser.findElement(By.css('#buttonList')).findElements(By.tagName('button'));
            await browser.wait(until.elementIsVisible(buttons[0]),4000)
            await buttons[0].click();
            
            await browser.wait(until.elementLocated(By.css('.unit')),4000);
            

            const origine = await browser.findElement(By.id('strategicMap'));
            const zone2place = await browser.findElement(By.id('Cross1'));
            const unit2move = await browser.findElement(By.name("1st Patrol"),10000);

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
            await browser.wait(until.elementIsVisible(mainMenu),4000);
            await mainMenu.click();
            const buttons = await browser.findElements(By.css('#buttonList > button'));
            await browser.wait(until.elementIsVisible(buttons[0]),4000);
            await buttons[0].click();
            await browser.wait(until.elementLocated(By.css('.unit')),4000);
            const turnNbDisplay = await browser.findElement(By.id('turn'));
            await browser.wait(async ()=>{
                let turnValue = parseInt(await turnNbDisplay.findElement(By.css('span')).getText());
                return turnValue;
                }, 20000);
        });
        it('open a dialog box when over turn number',async ()=>{
            const turn = await browser.findElement(By.id('turn'));
            await browser.actions({async:false}).move({origin: turn}).perform();
            const dialog= await browser.findElement(By.id('dialogWindow'));
            expect(dialog).to.exist;
            expect(await dialog.isDisplayed()).to.true;
            expect(await dialog.getAttribute('class')).to.not.include('gameBoardHide');
        });
        it('open a dialog window when over unit', async ()=>{
            const piece = await browser.findElement(By.name('1st Patrol'));
            await browser.wait(until.elementIsVisible(piece));
            await browser.actions({async:false}).move({origin: piece}).perform();
            const dialog= await browser.findElement(By.id('dialogWindow'));
            expect(await dialog.isDisplayed()).to.true;
        });
        it('hide any dialogWindow when out any unit or game data box as turn',async ()=>{
            const outOfany = await browser.findElement(By.id('dialogZone'));
            await browser.actions({async:true}).move({origin: outOfany}).perform();
            expect( await browser.findElement(By.id('dialogWindow')).isDisplayed()).to.false;
        })
    });

    describe ('[gameQOG] Running verification',()=>{
        before (async ()=>{
            await browser.get( browser.baseUrl); // to put context at the real begining
            const mainMenu = await browser.findElement(By.css('#mainMenu'));
            await browser.wait(until.elementIsVisible(mainMenu),4000);
            await mainMenu.click();
            const buttons = await browser.findElements(By.css('#buttonList > button'));
            await browser.wait(until.elementIsVisible(buttons[0]),4000);
            await buttons[0].click();
            const turnNbDisplay = await browser.findElement(By.id('turn'));
            await browser.wait(async ()=>{
                let turnValue = parseInt(await turnNbDisplay.findElement(By.css('span')).getText());
                return turnValue;
                }, 20000,"before statement");
        });

        it('first action points are initialised',async ()=>{
            const actionPointsDisplay = await browser.findElement(By.id('PA'));
            await browser.wait(async ()=>{
                let value = parseInt(await actionPointsDisplay.findElement(By.css('span')).getText());
                return value;
                }, 4000,"Action point not available");
            expect (parseInt(await actionPointsDisplay.findElement(By.css('span')).getText())).greaterThan(2);
        })
    })

});