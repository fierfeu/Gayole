'use strict'
const urlSiteValidator = require('./urlSiteValidator.js');
const targetDefinition = require('./targetDefinition.js');
const pageRender = require('./pageRender.js');
const fs = require('fs');

// Definition de la structure du site em mode KISS
const sitePagesConf ={
    '/':'src/Client/html/index.html',
    '/index.html':'src/Client/html/index.html',
    '/QOG_boardGame.html':'src/Client/html/boardGame.html',
    '/index.css' : 'src/Client/css/index.css',
    '/QuiOseGagneFE.png' : 'src/Client/images/QuiOseGagneFE.png',
    '/QOGMap1.jpg' : 'src/Client/images/QOGMap1.jpg',
    '/QOG_Head.js' : 'src/Client/js/QOG_Head.js',
    '/QOG.mjs' : 'src/Client/mjs/QOG.mjs',
    '/eventStorageInterface.mjs' : 'src/Client/mjs/eventStorageInterface.mjs',
    '/eventManager.mjs' : 'src/Client/mjs/eventManager.mjs',
    '/menu.mjs' : 'src/Client/mjs/menu.mjs',
    '/unit.mjs' : 'src/Client/mjs/unit.mjs',
    '/zone.mjs' : 'src/Client/mjs/zone.mjs',
    '/scenario.mjs' : 'src/Client/mjs/scenario.mjs',
    '/eventStorageInterface.mjs':'src/Client/mjs/eventStorageInterface.mjs',
    '/eventManager.mjs':'src/Client/mjs/eventManager.mjs',
    '/scenario_default.json':'src/Client/json/scenario_default.json',
    '/Hamburger_QOG_icon.png' : 'src/Client/images/Hamburger_QOG_icon.png',
    '/strategicMap.png' : 'src/Client/images/QOGMap.png',
    '/strategicBorder.png':'src/Client/images/strategicBorder.png',
    '/patrol1.png':'src/Client/images/patrol1.png',
    '/mainMenuTitle.ttf' : 'src/Client/font/mainMenuTitle.ttf',
    '/favicon.ico' : './src/Client/images/favicon.ico' 
};

module.exports ={

    handler : (req,res) => {
        let code = 404;
        let target ='./src/Client/html/404.html'; //TODO remove this hard coded value but today it's simple
        code = urlSiteValidator.validate(req.url,sitePagesConf);
        if (code===200) {
                target = targetDefinition.resolved(req.url,sitePagesConf);
        };
        pageRender.render(res,target,code);
    
    }
};
