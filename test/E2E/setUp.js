'use strict'
const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');
const chrome = require('selenium-webdriver/chrome');

var options = new chrome.Options();
options.addArguments('--start-maximized');
options.addArguments('--disable-popup-blocking');
options.addArguments('--dom-automation');
options.addArguments('--no-sandbox');
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");
options.addArguments("--disable-extensions");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--headless"); 


const host = (process.env.HOST || 'localhost');
const port = (process.env.PORT ||80);

before('Before any test suite to create webdriver',async ()=>{
    global.browser = new Builder().forBrowser('chrome')
        .setChromeOptions(options).build();
    //global.browser = new Builder().forBrowser('firefox').build();
    console.log('Before all');
    console.log('creation with host='+ host +' & PORT = '+ port);
    web.run(host,port);
    browser.baseUrl = "http://"+host+":"+port;
});

after ('To closed web driver',async () =>{
    await browser.quit();
    web.stop();
});