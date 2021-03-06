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
    '/QOG_Head.js' : 'src/Client/js/QOG_Head.js',
    '/QOG_Parser.mjs': 'src/Client/mjs/QOG_Parser.mjs',
    '/QOG.mjs' : 'src/Client/mjs/QOG.mjs',
    '/eventStorageInterface.mjs' : 'src/Client/mjs/eventStorageInterface.mjs',
    '/eventManager.mjs' : 'src/Client/mjs/eventManager.mjs',
    '/menu.mjs' : 'src/Client/mjs/menu.mjs',
    '/unit.mjs' : 'src/Client/mjs/unit.mjs',
    '/unitSet.mjs':'src/Client/mjs/unitSet.mjs',
    '/zone.mjs' : 'src/Client/mjs/zone.mjs',
    '/game.mjs' : 'src/Client/mjs/game.mjs',
    '/scenario.mjs' : 'src/Client/mjs/scenario.mjs',
    '/Didacticiel.mjs':'src/Client/mjs/Didacticiel.mjs',
    '/eventStorageInterface.mjs':'src/Client/mjs/eventStorageInterface.mjs',
    '/eventManager.mjs':'src/Client/mjs/eventManager.mjs',
    '/scenario_default.json':'src/Client/json/scenario_default.json',
    '/QuiOseGagneFE.png' : 'src/Client/images/QuiOseGagneFE.png',
    '/Hamburger_QOG_icon.png' : 'src/Client/images/Hamburger_QOG_icon.png',
    '/strategicMap.png' : 'src/Client/images/QOGMap.png',
    '/strategicBorder.png':'src/Client/images/strategicBorder.png',
    '/patrol1.png':'src/Client/images/patrol1.png',
    '/Axis-FC.png':'src/Client/images/Axis-FC.png',
    '/Axis_It_1.png':'src/Client/images/Axis_It_1.png',
    '/LRDG-T2A-recto.png':'src/Client/images/LRDG-T2A-recto.png',
    '/LRDG-T2A-verso.png':'src/Client/images/LRDG-T2A-verso.png',
    '/LRDG-T2B-recto.png':'src/Client/images/LRDG-T2B-recto.png',
    '/LRDG-T2B-verso.png':'src/Client/images/LRDG-T2B-verso.png',
    '/Axis_German_2.png':'src/Client/images/Axis_German_2.png',
    '/Axis_It_2.png':'src/Client/images/Axis_It_2.png',
    '/Axis_Ger_mob_2.png':'src/Client/images/Axis_Ger_mob_2.png',
    '/Axis_It_mob_2.png':'src/Client/images/Axis_It_mob_2.png',
    '/Axis_It_2_vet.png':'src/Client/images/Axis_It_2_vet.png',
    '/AlarmBackground.png':"src/Client/images/AlarmBackground.png",
    '/chrono.png':'src/Client/images/chrono.png',
    '/PA.png':'src/Client/images/PA.png',
    '/mainMenuTitle.ttf' : 'src/Client/font/mainMenuTitle.ttf',
    '/dd4tests.js':'src/Client/js/dd4tests.js',
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
