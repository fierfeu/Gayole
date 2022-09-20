'use strict'

const { doesNotMatch } = require("assert");
const chai = require("chai");
const expect = chai.expect;
const fs = require('fs')

const { Builder, By, Key, until } = require('selenium-webdriver');
const { fakeServer } = require("sinon");
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
            let turnValue = parseInt(await turnNbDisplay.findElement(By.css('span')).getAttribute('innerHTML'));
            return turnValue;
            }, 20000,"before statement");
        actionPoints = parseInt(await browser.findElement(By.id('PA')).findElement(By.css('span')).getAttribute('inner'));
    });

    it('When dragging a patrol to a new zone cost is shown', async ()=>{
        const origine = await browser.findElement(By.id('strategicMap'));
        const zone2place = await browser.findElement(By.id('Cross1'));
        let coords = await zone2place.getAttribute('coords');
        const unit2move = await browser.findElement(By.name("1st Patrol"),10000);  //name ?

        //use simulation for drag and drop
        await browser.actions({async:true}).move({origin: unit2move}).perform()
        await browser.executeScript(`const script = document.createElement('script');
                                        script.src = 'dd4tests.js';
                                        document.body.appendChild(script);`);
        await browser.sleep(500);
        await browser.executeScript(`dragMoveAndStay(arguments[0],arguments[1]);`,unit2move,zone2place);

        expect(await unit2move.getAttribute('class'),10000).to.contain('dragged');
        //let image = await browser.takeScreenshot()
        //await fs.writeFile('out.png',image,'base64', err => console.log(err))
        expect(await browser.findElement(By.id('MVTcost')).isDisplayed()).to.true;
        expect(await browser.findElement(By.id('MVTcost')).getText()).to.equal("-2");

        await browser.executeScript('endingDrag(arguments[0]);',unit2move);
    })

    it('is possible to draganddrop to cross1 as action points is more than 2 at beginning', async () =>{
        const zone2place = await browser.findElement(By.id('Cross1'));
        const unit2move = await browser.findElement(By.name("1st Patrol"));

        //use simulation for drag and drop
        await browser.actions({async:true}).move({origin: unit2move}).perform()
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
            let turnValue = parseInt(await turnNbDisplay.findElement(By.css('span')).getAttribute('innerHTML'));
            return turnValue;
            }, 20000,"before statement");
    });

    it('Allows by right clicking on a Patrol to access to Patrol action menu', async ()=>{
        let unit2RightClick = await browser.findElement(By.name('1st Patrol'));
        await browser.actions({async:true}).move({origin: unit2RightClick}).perform();
        let image = await browser.takeScreenshot();
        fs.writeFile("./test/images/rightclickPatrol.png",image,{encoding:'base64'}, (err)=>{if (err!=null) console.log(err)});
        await browser.actions({async:true}).contextClick(unit2RightClick).perform();
        const actionsMenu = await browser.findElement(By.id('contextualContainer'));
        await browser.actions({async:true}).move({origin: actionsMenu}).perform();
        image = await browser.takeScreenshot();
        fs.writeFile("./test/images/showActionMenu.png",image,{encoding:'base64'}, (err)=>{if (err!=null) console.log(err)});

        await browser.wait(until.elementIsVisible(actionsMenu),4000);
        expect(await browser.executeScript('return gameManager.currentGame.currentUnit'))
            .to.equal(await unit2RightClick.getAttribute('id'));
        const intelligenceItem = await browser.findElement(By.id('intelligence'))
        expect(await intelligenceItem.getAttribute('data-available')).to.equal("false")
        expect(await intelligenceItem.findElement(By.className('actionCost')).getAttribute('innerHTML'))
            .to.equal('2')
    });

    it('IntelligenceItem is available when on Cross1', async ()=>{
        //Arrange test context
        let unit2RightClick = await browser.findElement(By.name('1st Patrol'))
        const zone2place = await browser.findElement(By.id('Cross1'))
        await browser.executeScript(`const PA = document.getElementById('PA')
            PA.getElementsByTagName('span')[0].innerHTML='8'`)
        await browser.executeScript(`const script = document.createElement('script');
            script.src = 'dd4tests.js';
            document.body.appendChild(script);`)
        await browser.sleep(500)
        await browser.executeScript(`dragAndDrop(arguments[0],arguments[1]);`,unit2RightClick,zone2place)

        //Act to show contextual menu
        await browser.actions().contextClick(unit2RightClick).perform()
        const actionsMenu = browser.findElement(By.id('contextualContainer'))
        await browser.actions().move({origin: actionsMenu}).perform();
        await browser.wait(until.elementIsVisible(actionsMenu),4000)

        //Assert that intelligence Item is available to click
        expect(await browser.findElement(By.id('PA')).findElement(By.css('span')).getAttribute('innerHTML'))
            .to.equal('6')
        expect(await browser.findElement(By.id('intelligence')).getAttribute('data-available'))
            .to.equal('true')

        //Act to hover intelligence item
        const intelligenceItem= browser.findElement(By.id('intelligence'))
        await browser.actions({async:true}).move({origin: intelligenceItem}).perform()

        //Assert that elevation and background color change when hover
        expect(await intelligenceItem.getCssValue('background-color')).to.equal('rgba(200, 103, 23, 1)') // how to use css var ?
        expect(await intelligenceItem.getCssValue('box-shadow')).to.contain('rgba(95, 49, 12, 0.2) 0px 2px 1px -1px')
    })

});

