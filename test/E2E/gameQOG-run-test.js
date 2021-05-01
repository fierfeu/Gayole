'use strict'

const chai = require("chai");
const expect = chai.expect;

const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

describe ('[QOG run] movement behaviour',()=>{
    let actionPoints =0;
    beforeEach (async ()=>{
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
        actionPoints = parseInt(await browser.findElement(By.id('PA')).findElement(By.css('span')).getText());
    });

    it('When dragging a patrol to a new zone cost is shown', async ()=>{
        const origine = await browser.findElement(By.id('strategicMap'));
        const zone2place = await browser.findElement(By.id('Cross1'));
        let coords = await zone2place.getAttribute('coords');
        const unit2move = await browser.findElement(By.name("1st Patrol"));  //name ?

        //use simulation for drag and drop
        await browser.executeScript(`const script = document.createElement('script');
                                        script.src = 'dd4tests.js';
                                        document.body.appendChild(script);`);
        await browser.sleep(500);
        await browser.executeScript(`dragMoveAndStay(arguments[0],arguments[1]);`,unit2move,zone2place);

        expect(await unit2move.getAttribute('class')).to.contain('dragged');
        expect(await browser.findElement(By.id('MVTcost')).isDisplayed()).to.true;
        expect(await browser.findElement(By.id('MVTcost')).getText()).to.equal('-2');

        await browser.executeScript('endingDrag(arguments[0]);',unit2move);
    })

    it('is possible to draganddrop to cross1 as action points is more than 2 at beginning', async () =>{
        const zone2place = await browser.findElement(By.id('Cross1'));
        const unit2move = await browser.findElement(By.name("1st Patrol"));

        //use simulation for drag and drop
        await browser.executeScript(`const script = document.createElement('script');
                                        script.src = 'dd4tests.js';
                                        document.body.appendChild(script);`);
        await browser.sleep(500);
        await browser.executeScript(`dragMoveAndStay(arguments[0],arguments[1]);`,unit2move,zone2place);
        expect(await browser.findElement(By.id('MVTcost')).isDisplayed()).to.true;
        const cost = parseInt(await browser.findElement(By.id('MVTcost')).getText());
        await browser.executeScript('endingDrag(arguments[0]);',unit2move);
        
        if (actionPoints+cost > 0) {
            await browser.executeScript('dragAndDrop(arguments[0],arguments[1]);', unit2move,zone2place);
            expect(await browser.executeScript("return gameManager.zones['Cross1'].isInZone(gameManager.units['1st Patrol'])")).to.true;
            expect(parseInt(await browser.findElement(By.id('PA')).findElement(By.css('span')).getText())).to.equal(actionPoints+cost);
        }
    })
})

describe('[QOG Run Stealth] Intelligence action behaviour',()=>{
    beforeEach (async ()=>{
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

    it('Allows by right clicking on a Patrol to access to Patrol action menu', async ()=>{
        //context
        let actions = browser.actions();
        let unit2RightClick = await browser.findElement(By.name('1st Patrol'));
        const currentUnitId=await unit2RightClick.getAttribute('id');

        //test
        const unitRect = await unit2RightClick.getRect();
        await actions.contextClick(unit2RightClick).perform();
        const actionsMenu = await browser.findElement(By.id('contextualContainer'));
        await browser.wait(until.elementIsVisible(actionsMenu),6000);
        const menuRect = await actionsMenu.getRect();
        expect(menuRect.x).to.equal(unitRect.x+16);
        expect(menuRect.y).to.equal(unitRect.y+16);
        expect(await browser.executeScript('return gameManager.currentGame.currentUnit')).to.equal(currentUnitId);
    });

    it('manage intelligence item according to available zone (Siwa no and cross1 yes)',async ()=>{
        //context
        let actions = browser.actions();
        let unit2RightClick = await browser.findElement(By.name('1st Patrol'));
        const zone2place = await browser.findElement(By.id('Cross1'));
        const actionPoints = await browser.findElement(By.id('PA'));

        //test siwa => Intelligence not available
        await actions.contextClick(unit2RightClick).perform();
        const actionsMenu = await browser.findElement(By.id('contextualContainer'));
        const intelligenceItem = await actionsMenu.findElement(By.id('intelligence'));
        let ItemOpacity = await intelligenceItem.getCssValue('opacity');
        expect(ItemOpacity).to.equal('0.7');
        //expect(await browser.findElement(By.id('selectUnit2Second').isDisplayed)).to.false;
        await browser.findElement(By.id('strategicMap')).click();

        //drag and drop to Cross1 => Intelleigence available if enough AP
 
        //use simulation for drag and drop
        await browser.executeScript(`const script = document.createElement('script');
                                        script.src = 'dd4tests.js';
                                        document.body.appendChild(script);`);
        await browser.sleep(500);
        await browser.executeScript('dragAndDrop(arguments[0],arguments[1]);', unit2RightClick,zone2place);

        // set Action Points to 1 and verify that intelligence item is not available
        let PAValue=1;
        await browser.executeScript(`const PA = arguments[0].getElementsByTagName('span')[0];
                                     PA.innerText = arguments[1];`,actionPoints, PAValue);
        await actions.contextClick(unit2RightClick).perform();
        ItemOpacity = await intelligenceItem.getCssValue('opacity');
        expect(ItemOpacity).to.equal('0.7');
        await browser.findElement(By.id('strategicMap')).click();

        // set action point to 4 and verify availability
        PAValue=4;
        await browser.executeScript(`const PA = arguments[0].getElementsByTagName('span')[0];
                                     PA.innerText = arguments[1];`,actionPoints, PAValue);
        await actions.contextClick(unit2RightClick).perform();
        ItemOpacity = await intelligenceItem.getCssValue('opacity');
        expect(ItemOpacity).to.equal('1');
        await intelligenceItem.click();
        //expect(await browser.findElement(By.id('selectUnit2Second').isDisplayed)).to.true;
    });

});

