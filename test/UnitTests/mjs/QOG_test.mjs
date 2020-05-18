import QOG from '../../../src/Client/mjs/QOG.mjs';
import unit from '../../../src/Client/mjs/unit.mjs';
import zone from '../../../src/Client/mjs/zone.mjs';

import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import sinon from 'sinon';

var window;

const scenarList = '[{"name":"ScenarioTest","description":"Seul scénario disponible pour le moment"}]';

const QOGString = QOG.toString();
const ZONEString = zone.toString();
const HTML =    `<body>
                    <div id='GameBoard'>
                        <div id='dialogZone'>

                        </div>
                        <div id='strategicMap'>
                            
                        </div>
                    </div>      
                </body>`;

// 80% of the following tests won't be counted by c8 as they are performed under jsdom global env
// probably it would be interesting to remove QOG.mjs from test coverage 

describe ('[main QOG MJS] init functions work well',()=>{

    it('chooseScenario authorize to select a scenario and return his name to build url to json file',()=>{
        window = new JSDOM('',{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);
        expect(()=>{window.eval(QOGString +'QOG.prototype.chooseScenario()')}).to.throw();
        expect(()=>{window.eval(QOGString +'QOG.prototype.chooseScenario("scenarioName")')}).to.throw();
        expect(()=>{
            window.eval ( QOGString +
                "var scenarList = " + scenarList + ";" +
                "QOG.prototype.chooseScenario(scenarList)"
            )}).to.not.throw();
        expect(
            window.eval(
                QOGString +
                "var scenarList = " + scenarList + ";" +
                "QOG.prototype.chooseScenario(scenarList)"
            )).to.equal('ScenarioTest'); 
    });

/* **************************************************
 *  Conservé pour mémoire car si cette méthode      *
 *  est plus lisible elle est 2 fois plus longue    *
 *  à s'exécuter que la version précédente          *
 * **************************************************
    it('#2 chooseScenario authorize to select a scenario and return his name',()=>{
        const HTML = '<head><script>' + 
                    QOG.toString() +
                    '</script></head><body><body>';
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously',
            resources : 'usable',
            beforeParse(window) {
                window.alert = window.console.log.bind(window.console);
            }}).window;
        expect(()=>{window.eval('QOG.prototype.chooseScenario()')}).to.throw();
        expect(()=>{window.eval('QOG.prototype.chooseScenario("scenarioName")')}).to.throw();
        expect(()=>{
            window.eval (
                "var scenarList = " + scenarList + ";" +
                "QOG.prototype.chooseScenario(scenarList)"
            )}).to.not.throw();
        expect(
            window.eval(
                "const scenarList = " + scenarList + ";" +
                "QOG.prototype.chooseScenario(scenarList)"
            )).to.equal('ScenarioTest'); 
    });*/

    //beware today this function is include in game init but it could be interesting
    // to include it in a build process for a game.
    /*it('is possible to build, on server side, the game zones',()=>{
        expect(()=>{QOG.prototype.initZones()}).to.not.throw();
        expect (QOG.prototype.zones['Siwa']).to.exist;
        expect(QOG.prototype.zones['Siwa'] instanceof zone).to.be.true;
    });*/

    it('is possible to initiate, on client side, the game zones',()=>{
        const HTML = "<div id='strategicMap' class='strategicMap'>"+
                        "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>"+
                        "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
                        "</map><img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'></div>";

        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);
        expect (()=>{window.eval(
            QOGString+"\n"+
            ZONEString+"\n"+
            "QOG.prototype.initZones()")}).to.not.throw();
        expect (window.eval(
            QOGString+"\n"+
            ZONEString+"\n"+
            "QOG.prototype.initZones();"+
            "QOG.prototype.zones['Siwa'] instanceof zone;")).to.be.true;

        expect (window.eval(
            QOGString+"\n"+
            ZONEString+"\n"+
            "QOG.prototype.initZones();"+
            "QOG.prototype.zones['Siwa'].moveAllowedTo(QOG.prototype.zones['Cross1']);")).to.be.equal('1');
        
    });

    // test with window store in global to enhance tests coverage and it's easier to debug.
    it('is possible to initiate, on client side, the game zones with global',()=>{
        const HTML = "<div id='strategicMap' class='strategicMap'>"+
                        "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>"+
                        "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
                        "</map><img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'></div>";

        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        globalThis.window = window;
        globalThis.document = globalThis.window.document;
        expect (()=>{QOG.prototype.initZones()}).to.not.throw();
        expect (QOG.prototype.zones['Siwa'] instanceof zone).to.be.true;
        expect (QOG.prototype.zones['Siwa'].moveAllowedTo(QOG.prototype.zones['Cross1'])).to.be.equal('1');
        expect (QOG.prototype.zones['Cross1'].moveAllowedTo(QOG.prototype.zones['Siwa'])).to.be.equal('1');
        globalThis.window = undefined;
    });


    // the next functions are used as callback functions for xhr onload event  
    
    it('is possible tout initiate boardGame for QOG',()=>{
        const context = 'var boardRequest = {"status":200,"responseText":"'+
            "<div id='dialogZone' class='dialogZone'></div>"+
            "<div id='strategicMap' class='strategicMap'>"+
                "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'alt='Siwa'>"+
                "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
                "</map>"+
                "<img src='/strategicMap.png' usemap='#gameBoardMap'>"+
            "</div>"+
            '"}';
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);
        expect(()=>{window.eval(
            QOGString+";"+
            ZONEString+"\n"+
            context+";"+
            "QOG.prototype.initBoardGame.call(boardRequest);"
        )}).to.not.throw();
        expect(window.eval("document.getElementById('GameBoard').style.display")).to.equal('inline');
        expect(window.eval(
            "document.getElementById('GameBoard').getElementsByTagName('div')[1]")).to.exist;
        expect(window.eval(
            "document.getElementById('GameBoard').getElementsByTagName('div')[0].id")).to.equal('dialogZone');
        expect(window.eval(
            "document.getElementById('GameBoard').getElementsByTagName('div')[1].id")).to.equal('strategicMap');
        expect(window.eval(
            "const stratMap = document.getElementById('GameBoard').getElementsByTagName('div')[1];"+
            "stratMap.getElementsByTagName('img');"
        )).to.exist;
        expect(window.eval(
            "const stratMap = document.getElementById('GameBoard').getElementsByTagName('div')[1];"+
            "stratMap.getElementsByTagName('img')[0].src;"
        )).to.equal('http://localhost/strategicMap.png');
    });

    it('is possible to place units on board',()=>{
        const HTML = "<div id='strategicMap' class='strategicMap'>"+
                        "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>"+
                        "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
                        "</map><img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'></div>";
        
        let jsonhttp = {"status":200};
        jsonhttp.responseText ={"units":[{"images":{"recto":"/patrol1.png"},"name":"1st Patrol","description":"my first patrol in game"}],
                                "zones":{"Siwa":"1st Patrol"}};
        const jsonZoneDesc = jsonhttp.responseText.zones;
        const scenario = {"units":[{"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol","description":"my first patrol in game"}]};
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        globalThis.window = window;
        globalThis.document = globalThis.window.document;
        QOG.prototype.units = [];
        QOG.prototype.units['1st Patrol'] = new unit (
            scenario.units[0].images,
            scenario.units[0].name,
            scenario.units[0].description
        );
        QOG.prototype.zones=[];
        const area = document.getElementById('Siwa');
        QOG.prototype.zones['Siwa'] = new zone (area,'Siwa');
        expect(()=>{QOG.prototype.placeUnits()}).to.throw('ERROR needs of a json description');
        expect(()=>{QOG.prototype.placeUnits(jsonZoneDesc)}).to.not.throw();
        expect(QOG.prototype.zones['Siwa'].units['1st Patrol']).to.equal(QOG.prototype.units['1st Patrol']);
        const imgs = document.getElementById('strategicMap').getElementsByTagName('img');
        expect (imgs.length).to.equal(2);
        expect(imgs[1].src).to.equal('http://localhost/patrol1.png');
        globalThis.document = globalThis.window = undefined;
    });

    it('is possible tout initiate a scenario and all units with QOG',()=>{
        const json = fs.readFileSync('./test/UnitTests/json/ScenarioTest.json','utf8');
        var jsonhttp = {"status":200};
        jsonhttp.responseText = json;
        QOG.prototype.units = [];
        expect(()=>{QOG.prototype.initScenario.call(jsonhttp);}).to.not.throw;
        QOG.prototype.initScenario.call(jsonhttp);
        expect(QOG.prototype.units['1st Patrol']).to.exist;
        expect(QOG.prototype.units['1st Patrol'].images['recto']).to.equal("/patrol1.png");
    });

    it('is not possible to instanciate a new QOG object',()=>{
        const eventInterfaceString = "class eventStorageInterface {constructor (context,storage){this.context=context;this.storage=storage}}";
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "new QOG();"
        )}).to.throw('ERROR QOG is not instanciable');
    });
});

describe('[main QOG MJS] Create function works well',()=>{
    it('create function throw errors when bad usage',()=>{
        const eventInterfaceString = "class eventStorageInterface {constructor (context,storage){this.context=context;this.storage=storage}}";
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);
        window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        const server = sinon.fakeServer.create();

        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "globalThis.game = QOG.prototype;"+
            "game.create();"
        )}).to.not.throw();
        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "globalThis.game = QOG.prototype;"+
            "game.create('fierfeu');"
        )}).to.not.throw();

        server.restore();
    });
});