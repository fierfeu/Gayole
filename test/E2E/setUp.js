'use strict'
const { Builder, By, Key, until } = require('selenium-webdriver');
const web = require('../../src/Servers/App/index.js');

const host = (process.env.HOST || 'localhost');
const port = (process.env.PORT ||80);

before('Before any test suite to create webdriver',async ()=>{
    global.browser = new Builder().forBrowser('chrome').build();
    console.log('creation with host='+ host +' & PORT = '+ port);
    web.run(host,port);
    browser.baseUrl = "http://"+host+":"+port;
});

after ('To closed web driver',async () =>{
    await browser.quit();
    web.stop();
});