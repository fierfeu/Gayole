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
    '/en/actionsMenu.html':'src/Client/html/en/actionsMenu.html',
    '/index.css' : 'src/Client/css/index.css',
    '/actionMenu.css':'src/Client/css/actionMenu.css',
    '/ept.css':'src/Client/css/games:ept.css',
    '/Head.js' : 'src/Client/js/Head.js',
    '/QOG_Parser.mjs': 'src/Client/mjs/QOG_Parser.mjs',
    '/QOG.mjs' : 'src/Client/mjs/QOG.mjs',
    '/EPT.mjs' : 'src/Client/mjs/EPT.mjs',
    '/eventStorageInterface.mjs' : 'src/Client/mjs/eventStorageInterface.mjs',
    '/eventManager.mjs' : 'src/Client/mjs/eventManager.mjs',
    '/menu.mjs' : 'src/Client/mjs/menu.mjs',
    '/unit.mjs' : 'src/Client/mjs/unit.mjs',
    '/unitSet.mjs':'src/Client/mjs/unitSet.mjs',
    '/zone.mjs' : 'src/Client/mjs/zone.mjs',
    '/game.mjs' : 'src/Client/mjs/game.mjs',
    '/scenario.mjs' : 'src/Client/mjs/scenario.mjs',
    '/Didacticiel.mjs':'src/Client/mjs/Didacticiel.mjs',
    '/eventManager.mjs':'src/Client/mjs/eventManager.mjs',
    '/scenario_default.json':'src/Client/json/scenario_default.json',
    '/en/helper.json':'src/Client/json/en/helper.json',
    '/QuiOseGagneFE.png' : 'src/Client/images/QuiOseGagneFE.png',
    '/Hamburger_icon.png' : 'src/Client/images/Hamburger_icon.png',
    '/strategicMap.png' : 'src/Client/images/games/QOG/QOGMap.png',
    '/strategicBorder.png':'src/Client/images/strategicBorder.png',
    '/vaevictis-logo.jpg':'src/Client/images/vaevictis-logo.jpg',
    '/patrol1.png':'src/Client/images/games/QOG/patrol1.png',
    '/Axis-FC.png':'src/Client/images/games/QOG/Axis-FC.png',
    '/Axis_It_1.png':'src/Client/images/games/QOG/Axis_It_1.png',
    '/LRDG-T2A-recto.png':'src/Client/images/games/QOG/LRDG-T2A-recto.png',
    '/LRDG-T2A-verso.png':'src/Client/images/games/QOG/LRDG-T2A-verso.png',
    '/LRDG-T2B-recto.png':'src/Client/images/games/QOG/LRDG-T2B-recto.png',
    '/LRDG-T2B-verso.png':'src/Client/images/games/QOG/LRDG-T2B-verso.png',
    '/Axis_German_2.png':'src/Client/images/games/QOG/Axis_German_2.png',
    '/Axis_It_2.png':'src/Client/images/games/QOG/Axis_It_2.png',
    '/Axis_Ger_mob_2.png':'src/Client/images/games/QOG/Axis_Ger_mob_2.png',
    '/Axis_It_mob_2.png':'src/Client/images/games/QOG/Axis_It_mob_2.png',
    '/Axis_It_2_vet.png':'src/Client/images/games/QOG/Axis_It_2_vet.png',
    '/AlarmBackground.png':"src/Client/images/games/QOG/AlarmBackground.png",
    '/chrono.png':'src/Client/images/games/QOG/chrono.png',
    '/PA.png':'src/Client/images/games/QOG/PA.png',
    '/mainMenuTitle.ttf' : 'src/Client/font/mainMenuTitle.ttf',
    '/dd4tests.js':'src/Client/js/dd4tests.js',
    '/favicon.ico' : './src/Client/images/favicon.ico',
    '/QOG.png' : './src/Client/images/QOG.png',
    '/EPT.png' : './src/Client/images/EPT.png',
    '/storageWorker.js' : './src/Client/js/storageWorker.js' 
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
