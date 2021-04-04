'use strict'

const chai = require("chai");
const expect = chai.expect;

const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

const {Simulate} = require('../../src/Client/mjs/DragAndDrop4Tests.js');

describe ('[QOG run] movement behaviour',()=>{
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

    it('When dragging a patrol to a new zone cost is shown', async ()=>{
        const origine = await browser.findElement(By.id('strategicMap'));
        const zone2place = await browser.findElement(By.id('Cross1'));
        let coords = await zone2place.getAttribute('coords');
        const unit2move = await browser.findElement(By.name("1st Patrol"));  //name ?

        //use simulation for drag and drop
        await browser.executeScript(`const script = document.createElement('script');
                                        script.src = 'dd4tests.js';
                                        document.body.appendChild(script);`);
        await browser.executeScript(`dragMoveAndStay(arguments[0],arguments[1]);`,unit2move,zone2place);
        
        expect(await unit2move.getAttribute('class')).to.contain('dragged');
        expect(await browser.findElement(By.id('MVTcost')).isDisplayed()).to.true;
    })
})