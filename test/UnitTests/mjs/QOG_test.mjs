import QOG from '../../../src/Client/mjs/QOG.mjs';
import unit from '../../../src/Client/mjs/unit.mjs';
import {unitSet} from '../../../src/Client/mjs/unitSet.mjs';
import zone from '../../../src/Client/mjs/zone.mjs';
import scenario from '../../../src/Client/mjs/scenario.mjs';

import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import sinon from 'sinon';

var window;

const scenarList =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];

const QOGString = QOG.toString();
const EMPTYHTML = "<body><div id='gameBoard'></div></body>"
const HTML =    `<body>
                    <div id='gameBoard'>
                        <div id='dialogZone'>
                            <div Id='turn' class="turnNB warLetters"><span style="display:block;">16</span></div>
                        </div>
                        <div id='strategicMap'>
                            <map name='gameBoardMap'>
                                <area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>
                                <area shape='rect' id='Cross1' data-ground="desert" data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>
                            </map>
                            <img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'>
                        </div>
                    </div>      
                </body>`;

const board =  `<div id='dialogZone' class='dialogZone'></div>
                <div id='strategicMap' class='strategicMap'>
                    <script ></script>
                    <map name='gameBoardMap'>
                        <area shape='rect' id='Siwa' coords='685,457,726,500' title='Siwa'>
                    </map>
                    <img src='/strategicMap.png' style='width:1100px;'>
                </div>`;

const SCENAR = `{
                    "description":{
                        "name":"testName",
                        "long":"longue description",
                        "short":"short desc"
                    },
                    "LRDG":{"units":{"Nb":1,
                        "unitsDesc":[
                            {"images":{"recto":"/LRDG-T2A-recto.png","verso":"/LRDG-T2A-verso.png"},
                            "name":"LRDGT2A",
                            "description":"unit Australienne T2-A",
                            "values":{"draggable":true}
                            }]
                            },"detachments":"test","patrols":"test","localisations":{"zones":{"Siwa":"LRDGT2A"}}},
                    "Axis":{"units":"test","detachments":"test","patrols":"test","localisations":{"town":["random","test1","test2"]}},
                    "conditions":{
                        "roundNb": 1,
                        "returnZone" :["Siwa"],
                        "victoryTest":"()=>{return true}"
                    }
                }`;

describe('[QOG for gameManager] QOG prototype content good gameManager Interface', ()=>{
    const sandbox = sinon.createSandbox();

    after(()=>{
        sandbox.restore();
    })

    it('has boards function',()=>{
        expect(QOG.prototype.boards).to.exist;
        expect(typeof QOG.prototype.boards).to.equal('function');
    });

    it('has setUp function',()=>{
        expect(QOG.prototype.setUp).to.exist;
        expect(typeof QOG.prototype.setUp).to.equal('function');
    })

    it('boards function initiate boards for Qui Ose Gagne',async ()=>{
        globalThis.document = new JSDOM(EMPTYHTML).window.document;
        let gameManager={};
        gameManager.loadExternalRessources = (opts) => {
            gameManager.load=true;
            return new Promise((resolve)=>{resolve(board)}) };
        let initZonesSpy = sandbox.spy(QOG.prototype,"initZones");
        
        await QOG.prototype.boards.call(gameManager);
        expect(document.getElementById('strategicMap')).to.exist;
        expect (document.getElementsByName('gameBoardMap')).to.exist;
        expect(document.getElementsByName('gameBoardMap')[0].areas.length).to.equal(1);
        expect(initZonesSpy.calledOnceWith(gameManager)).to.true;

        globalThis.document=undefined;
        initZonesSpy.restore();
    });

    it('setUp function initiate scenario data and pieces for the game QOG',async  ()=>{
        globalThis.document = new JSDOM(HTML).window.document;
        let gameManager = {};
        gameManager.zones={};
        gameManager.zones['Siwa'] = new zone (document.getElementById('Siwa'),'Siwa');
        gameManager.loadExternalRessources = (opts) => {return new Promise((resolve)=>{resolve(SCENAR)}) };
        const parserSpy = sandbox.spy(QOG.prototype,"scenarioParser");
        const initScenarSpy = sandbox.spy(QOG.prototype,"initScenario");

        await QOG.prototype.setUp.call(gameManager);
        expect (parserSpy.calledOnceWith(JSON.parse(SCENAR),gameManager)).to.true;
        expect(gameManager.currentScenario).to.exist;
        expect(gameManager.currentScenario instanceof scenario).to.true;
        expect(gameManager.currentScenario.opponent[0]).to.equal(2);
        expect(gameManager.currentScenario.opponent[1][0]).to.equal('LRDG');
        expect (initScenarSpy.calledOnceWith(gameManager.currentScenario)).to.true;
        expect(gameManager.units).to.exist;
        expect(gameManager.units["LRDGT2A"]).to.exist;
        expect(gameManager.units["LRDGT2A"] instanceof unit).to.true;
        expect(gameManager.units["LRDGT2A"].name).to.equal("LRDGT2A");
        expect(gameManager.zones["Siwa"].units["LRDGT2A"]).to.exist;
        expect(gameManager.zones["Siwa"].units["LRDGT2A"]).to.equal(gameManager.units["LRDGT2A"])
        expect(document.getElementById('turn').getElementsByTagName('span')[0].innerHTML).to.equal('1');

        globalThis.document=undefined;
    });
});

describe ('[QOG] init functions work well',()=>{

    it('is possible to initiate the game zones with all datas',()=>{
        window = new JSDOM(HTML,{url:'http://localhost/'}).window;
        globalThis.window = window;
        globalThis.document = globalThis.window.document;
        expect (()=>{QOG.prototype.initZones()}).to.not.throw();
        expect (QOG.prototype.zones['Siwa'] instanceof zone).to.be.true;
        expect (QOG.prototype.zones['Siwa'].moveAllowedTo(QOG.prototype.zones['Cross1'])).to.be.equal('1');
        expect (QOG.prototype.zones['Cross1'].moveAllowedTo(QOG.prototype.zones['Siwa'])).to.be.equal('1');
        expect (QOG.prototype.zones['Cross1'].Element.ondragover).to.be.equal(QOG.prototype.dragoverHandler);
        expect (QOG.prototype.zones['Cross1'].Element.ondrop).to.be.equal(QOG.prototype.dropHandler);
        expect(QOG.prototype.zones['Cross1'].hasOwnProperty('ground')).to.true;
        expect(QOG.prototype.zones['Cross1'].ground).to.equal('desert');
        globalThis.window = globalThis.document = undefined;
    });

    it ('ispossible to load Zones data in a given object if provided as a parameter',()=>{
        globalThis.document =new JSDOM(HTML).window.document;
        let gameManager={};
        expect (()=>{QOG.prototype.initZones(gameManager)}).to.not.throw();
        expect (gameManager.zones['Siwa']).to.exist;
        expect (QOG.prototype.zones['Siwa'] instanceof zone).to.be.true;
    })

    it("there's a function to place pieces on board",() =>{
        let unit2place = new unit(
            {"recto":"/patrol1.png"},
            "1st Patrol",
            "description",
            {"value":true}
        );
        let window = new JSDOM(HTML,{url:'http://localhost/'}).window;
        globalThis.document = window.document;
        const area = document.getElementById('Siwa');
        let zone2use = new zone (area,'Siwa');

        expect(()=>{QOG.prototype.placeAPiece()}).to.throw("ERROR - QOG.placeAPiece : no unit declared");
        expect(()=>{QOG.prototype.placeAPiece("blabla")}).to.throw("ERROR - QOG.placeAPiece : no unit declared");
        expect(()=>{QOG.prototype.placeAPiece(unit2place)}).to.throw("ERROR - QOG.PlaceAPiece : No zone declared");
        expect(()=>{QOG.prototype.placeAPiece(unit2place,"blabla")}).to.throw("ERROR - QOG.PlaceAPiece : No zone declared");
        expect(()=>{QOG.prototype.placeAPiece(unit2place,zone2use)}).to.not.throw();

        expect(document.getElementsByTagName('img').length).to.equal(2);
        let thePiece = document.getElementsByTagName('img')[1];
        expect(thePiece.name).to.equal("1st Patrol");
        expect(thePiece.src).to.equal("http://localhost/patrol1.png");
        expect(thePiece.getAttribute("draggable")).to.equal('false');
        
        unit2place = new unit(
            {"recto":"/patrol1.png"},
            "1st Patrol",
            "description",
            {"draggable":true}
        );
        QOG.prototype.placeAPiece(unit2place,zone2use);
        expect(document.getElementsByTagName('img').length).to.equal(3);
        let Piece2 = document.getElementsByTagName('img')[2];
        expect(Piece2.name).to.equal("1st Patrol");
        expect(Piece2.src).to.equal("http://localhost/patrol1.png");
        expect(Piece2.getAttribute("draggable")).to.equal('true');
        expect(Piece2.ondragstart).to.equal(QOG.prototype.dragStartHandler);
        expect (thePiece.id).to.not.equal(Piece2.id);
        let coords=zone2use.Element.coords;
        coords=coords.split(',');
        let left =Number(coords[0])+5;
        let top = Number(coords[1])+5;
        expect(Piece2.style.top).to.equal(top+"px");
        expect(Piece2.style.left).to.equal(left+"px");

        globalThis.document = undefined;
    })

    it('is possible to place units on board with a zone definition',()=>{
        const jsonZoneDesc ={"zones":{"Siwa":"1st Patrol"}};
        const unitDesc = {"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol","description":"my first patrol in game"}; 
        globalThis.document = new JSDOM(HTML,{url:'http://localhost/'}).window.document;
        let gameManager = {"units":{},"zones":{}};
        gameManager.units['1st Patrol'] = new unit (
            unitDesc.images,
            unitDesc.name,
            unitDesc.description,
            {"draggable":true}
        );
        gameManager.zones={};
        // initZones Simulation
        const area = document.getElementById('Siwa');
        gameManager.zones['Siwa'] = new zone (area,'Siwa');
        gameManager.zones['Siwa'].Element.ondragover=QOG.prototype.dragoverHandler;
        
        expect(()=>{QOG.prototype.placeUnits()}).to.throw('ERROR needs of a json description');
        expect(()=>{QOG.prototype.placeUnits(jsonZoneDesc,false)}).to.throw('ERROR placeUnits needs an objetc to store units');
        expect(()=>{QOG.prototype.placeUnits(jsonZoneDesc,false,gameManager)}).to.not.throw();
        expect(gameManager.zones['Siwa'].units['1st Patrol']).to.equal(gameManager.units['1st Patrol']);
        expect(gameManager.zones['Siwa'].Element.ondragover).to.equal(QOG.prototype.dragoverHandler);
        const imgs = document.getElementById('strategicMap').getElementsByTagName('img');
        expect (imgs.length).to.equal(2);
        expect(imgs[1].getAttribute("draggable")).to.equal('true');
        expect(imgs[1].ondragstart).to.equal(QOG.prototype.dragStartHandler);

        // verify for Axis opponent that we can desallow drag&drop when an axis unit is in the zone
        gameManager.zones['Siwa'].Element.ondragover=QOG.prototype.dragoverHandler;
        const cross = document.getElementById('Cross1');
        gameManager.zones['Cross1'] = new zone (cross,'Cross1');
        gameManager.zones['Cross1'].Element.ondragover=QOG.prototype.dragoverHandler;
        QOG.prototype.placeUnits(jsonZoneDesc,true, gameManager); 
        expect(gameManager.zones['Siwa'].Element.ondragover).to.be.null;
        expect(gameManager.zones['Cross1'].Element.ondragover).to.equal(QOG.prototype.dragoverHandler);

        globalThis.document = globalThis.window = undefined;
    });

    it('is possible to place units randomly for a given type of ground',()=>{
        const jsonZoneDesc ={"town":["random",{"name":"1st Patrol"}]};
        const unitDesc = {"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol","description":"my first patrol in game"}; 
        globalThis.document = new JSDOM(HTML,{url:'http://localhost/'}).window.document;
        let gameManager = {"units":{},"zones":{}}
        gameManager.units['1st Patrol'] = new unit (
            unitDesc.images,
            unitDesc.name,
            unitDesc.description,
            {"draggable":false}
        );
        gameManager.zones=[];
        // initZones Simulation
        const area = document.getElementById('Siwa');
        gameManager.zones['Siwa'] = new zone (area,'Siwa');
        gameManager.zones['Siwa'].Element.ondragover=QOG.prototype.dragoverHandler;
        gameManager.zones['Siwa'].ground="town";

        expect(()=>{QOG.prototype.placeUnits(jsonZoneDesc,true,gameManager)}).to.not.throw();
        expect(gameManager.zones['Siwa'].units['1st Patrol']).to.exist;
        expect(gameManager.zones['Siwa'].Element.ondragover).to.be.null;

    });

    it('is possible to initiate ramdomly define units for a given ground type',()=>{
      
        const jsonDesc =["random",
                {"name":"1st Patrol"},
                {"name":"Axis1"}
            ];
        const unitDesc = {"images":{"recto":"/patrol1.png"},
        "name":"1st Patrol","description":"my first patrol in game"}; 

        window = new JSDOM(HTML,{url:'http://localhost/'}).window;
        globalThis.window = window;
        globalThis.document = globalThis.window.document;
        QOG.prototype.units = [];    
        QOG.prototype.units['1st Patrol'] = new unit (
            unitDesc.images,
            unitDesc.name,
            unitDesc.description,
            {"draggable":true}
        );
        QOG.prototype.units['Axis1'] = new unit (
            unitDesc.images,
            'Axis1',
            unitDesc.description,
            {"draggable":false}
        );
        QOG.prototype.zones= [];
        const area = document.getElementById('Siwa');
        QOG.prototype.zones['townSiwa'] = new zone (area,'townSiwa',{"ground":"town"});    
        
        expect(()=>{QOG.prototype.randomizeUnit()}).to.throw();
        expect(()=>{QOG.prototype.randomizeUnit(QOG.prototype.zones['townSiwa'],jsonDesc, QOG.prototype)}).to.not.throw();
        expect(Object.keys(QOG.prototype.zones['townSiwa'].units).length).to.equal(1);
        expect(Object.keys(QOG.prototype.zones['townSiwa'].units)[0]).to.be.oneOf(["1st Patrol","Axis1"])
        
    });

    it('is possible to initiate a scenario and all units with QOG',()=>{
        const dataObject = JSON.parse(fs.readFileSync('./test/UnitTests/json/ScenarioTest.json','utf8'));
        window = new JSDOM(HTML,{url:'http://localhost/'}).window;
        globalThis.currentScenario = new scenario(scenarList);
        globalThis.document = window.document;
        QOG.prototype.units=[];
        let mockedPlaceUnits = sinon.mock(QOG.prototype).expects('placeUnits').twice();

        let currentScenario = QOG.prototype.scenarioParser(dataObject);
        expect(()=>{QOG.prototype.initScenario(currentScenario);}).to.not.throw();
        expect(mockedPlaceUnits.verify()).to.true;
        expect(QOG.prototype.units['LRDGT2A']).to.exist;
        expect(QOG.prototype.units['LRDGT2A'].images['recto']).to.equal("/LRDG-T2A-recto.png");
        expect(QOG.prototype.units['1st Patrol']).to.exist;
        const patrol = QOG.prototype.units['1st Patrol'];
        expect(patrol.images['recto']).to.equal("/patrol1.png");
        expect(patrol instanceof unitSet).to.true;
        expect(patrol.units["LRDGT2B"]).to.exist;
        
        globalThis.currentScenario=undefined;
        globalThis.document=undefined;
    });

    it('is not possible to instanciate any QOG object',()=>{
        const eventInterfaceString = "class eventStorageInterface {constructor (context,storage){this.context=context;this.storage=storage}}";
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "new QOG();"
        )}).to.throw('ERROR QOG is not instanciable');
    });
});

describe('[QOG] scenario parser works well',()=>{
    const goodData = {
        "description":{
            "name":"testName",
            "long":"longue description", // beware not multilingue !
            "short":"short desc"
        },
        "LRDG":{"units":"test","detachments":"test","patrols":"test","localisations":{"Siwa":"test"}},
        "Axis":{"units":"test","detachments":"test","patrols":"test","localisations":{"town":["random","test1","test2"]}},
        "conditions":{
            "roundNb": 1,
            "returnZone" :["Siwa"],
            "victoryTest":"()=>{return true}"
        }
    };

    it('is possible to call scenario parser with data object',()=>{
        
        const data={"value":"toVerify"};
        expect (()=>{QOG.prototype.scenarioParser()}).to.throw('ERROR no scenario data to parse : no scenario initiated');
        expect (()=>{QOG.prototype.scenarioParser("whatEverExceptGood")}).to.throw('ERROR badly formated scenario data to parse: no scenario initiated');
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: ');
        expect (()=>{QOG.prototype.scenarioParser(goodData)}).to.not.throw();
        let current = QOG.prototype.scenarioParser(goodData);
        expect (current.opponent[0]).equal(2);
        
    });
    // at first level of keys a good scenario descriptor file must contains : a description zone, a victoryconditions zone and 2 opponents zones: (LRDG & Axis)

    it('has a good "description" zone parser',()=>{
        let data ={"value":"test"};
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no scenario description Object');
        data = {"description":"test","conditions":"test","LRDG":"test","Axis":"test"};
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no scenario name in description');
        // no ERROR for long and short as they are not yet mandatory
        const currentScenario = QOG.prototype.scenarioParser(goodData);
        expect(currentScenario.description.name).to.equal("testName");
        expect(currentScenario.description.long).to.equal("longue description");
        expect(currentScenario.description.short).to.equal("short desc");
    });

    it('has good "conditions" zone parser',()=>{
        let data = {"description":{
            "name":"test"
            }
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no vitory conditions defined');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":"test",
            "LRDG":"test",
            "Axis":"test"
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no roundNb in victory conditions');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb":1
            },
            "LRDG":"test",
            "Axis":"test"
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no returnZone in victory conditions');
        // conditions.testis not mandatory
        let currentScenario = QOG.prototype.scenarioParser(goodData);
        expect(currentScenario.hasOwnProperty('conditions')).to.true;
        //expect(scenar).to.have.key("conditions");
        expect(currentScenario.conditions.roundNb).to.equal(1);
        expect(currentScenario.conditions.returnZone).to.deep.equal(['Siwa']);
        expect(currentScenario.conditions.victoryTest).to.equal("()=>{return true}");
    });

    it('has good opponents parsing',()=>{
        let data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            }
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no opponent name for side: LRDG');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":"test"
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no opponent name for side: Axis');
    });

    it('has good structure inside opponent description',()=>{
        let data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":"test",
            "Axis":"test"
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no units definition');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":{"units":"test","detachments":"test","patrols":"test","localisations":""},
            "Axis":"test"
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no units definition for opponent: Axis');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":{"units":"test","patrols":"test","localisations":""},
            "Axis":{"units":"test","detachments":"test","patrols":"test","localisations":""}
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no detachments definition for opponent: LRDG');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":{"units":"test","detachments":"test","patrols":"test","localisations":""},
            "Axis":{"units":"test","patrols":"test","localisations":""}
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no detachments definition for opponent: Axis');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":{"units":"test","detachments":"test","patrols":"test","localisations":""},
            "Axis":{"units":"test","detachments":"test","localisations":""}
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no patrols definition for opponent: Axis');
        data = {
            "description":{
                "name":"test"
            },
            "conditions":{
                "roundNb": 1 ,
                "returnZone":['Siwa']
            },
            "LRDG":{"units":"test","detachments":"test","patrols":"test"},
            "Axis":{"units":"test","detachments":"test"}
        };
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no localisations definition for opponent: LRDG');
        let currentScenario = QOG.prototype.scenarioParser(goodData);
        expect(currentScenario.hasOwnProperty('opponent')).to.true;
        //expect(QOG.prototype.scenario).to.have.key('opponent');
        expect(currentScenario.opponent[0]).to.equal(2);
        expect(currentScenario.opponent[1][0]).to.equal('LRDG');
        expect(currentScenario.opponent[2][0]).to.equal('Axis');
        let LRDG = currentScenario.opponent[1][1];
        expect(LRDG.hasOwnProperty('units')).to.true;
        expect(LRDG.units).to.equal('test');
        expect(LRDG.hasOwnProperty('detachments')).to.true;
        expect(LRDG.detachments).to.equal('test');
        expect(LRDG.hasOwnProperty('patrols')).to.true;
        expect(LRDG.patrols).to.equal('test');
        expect(LRDG.hasOwnProperty('localisations')).to.true;
        expect(LRDG.localisations.hasOwnProperty('Siwa')).to.true;
        expect(LRDG.localisations.Siwa).to.equal('test');
    });

    it('is possible to place pieces for a given ground type',()=>{
        let currentScenario = QOG.prototype.scenarioParser(goodData);
        let Axis = currentScenario.opponent[2][1];
        expect(Axis.localisations.hasOwnProperty('town')).to.true;
        expect(Array.isArray(Axis.localisations.town)).to.true;
        expect(Axis.localisations.town[0]).to.equal('random');
    })

});

describe ('[QOG game event] all game board event are initialised',()=>{
    
    const board = fs.readFileSync('src/Client/html/boardGame.html');
    it('turnNb div has mouseOver and mouseOut event managed',()=>{
        globalThis.document=undefined;
        expect(()=>{QOG.prototype.initGameEvent()}).to.throw();
        globalThis.document = new JSDOM(board).window.document;
        expect(()=>{QOG.prototype.initGameEvent()}).to.not.throw();
        const turnId =document.getElementById('turn');
        expect (turnId.dataset.help).to.equal("This zone gives you the remaining number of turn before historical achievement. You'll loose Victory points while finishing the mission over this time")
        expect(turnId.onmouseover).to.equal(QOG.prototype.showHelp);
        expect(turnId.onmouseout).to.equal(QOG.prototype.hideHelp);
    });

    it('showHelp function show good content',()=>{
        let ev={};
        globalThis.document= new JSDOM(board,{pretendToBeVisual:true}).window.document;
        const turnNB = document.getElementById('turn');
        const helpWin = document.getElementById('dialogWindow');
        expect (helpWin.className).to.include('gameBoardHide');
        ev.currentTarget=turnNB;
        expect(()=>{QOG.prototype.showHelp(ev)}).to.not.throw();
        expect (helpWin.className).to.not.include('gameBoardHide');
        expect (helpWin.innerHTML).to.equal(turnNB.dataset.help);
        expect (helpWin.style.left).to.equal('950px');
    });

    it('hideHelp function hide help window and empty window content',()=>{
        let ev={};
        globalThis.document= new JSDOM(board,{pretendToBeVisual:true}).window.document;
        const helpWin = document.getElementById('dialogWindow');
        helpWin.classList.toggle('gameBoardHide');
        expect(()=>{QOG.prototype.hideHelp(ev)}).to.not.throw();
        expect (helpWin.className).to.include('gameBoardHide');
        expect(helpWin.innerHTML).to.equal('');
    })
});

describe('[QOG drag&drop] is possible to move a unit to a zone linked',() =>{
    let ev ={dataTransfer:{}};
    beforeEach (()=>{
        globalThis.document = new JSDOM('<mapname="mappy"><area id="Cross1" shape="rect" coords="100,100,200,200"> </map>'+
            '<img name="1st Patrol" usemap="#mappy" style="position:absolute;top:520px;left:694px;" src="/patrol.png">',
            {pretendToBeVisual:true}).window.document;
        const scenario = {"units":[{"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol","description":"my first patrol in game"}]};
        globalThis.gameManager = {"units":{},"zones":{}};
        gameManager.units['1st Patrol'] = new unit (
            scenario.units[0].images,
            scenario.units[0].name,
            scenario.units[0].description );
        gameManager.zones=[];
        gameManager.zones['Siwa'] = new zone(document.getElementsByTagName('area')[0],'Siwa');
        gameManager.zones['Cross1']= new zone(document.getElementsByTagName('area')[0],'Cross1');
        gameManager.zones['Siwa'].linkTo(gameManager.zones['Cross1'],1);
        gameManager.zones['Cross1'].linkTo(gameManager.zones['Siwa'],1);
        gameManager.zones['Siwa'].attach(gameManager.units['1st Patrol']);
        ev.dataTransfer.setData = (key,value) => { ev.dataTransfer[key]=value};
        ev.dataTransfer.getData = (key) => {return ev.dataTransfer[key]};
    });

    afterEach (()=>{
        globalThis.document=globalThis.gameManager =undefined;
    });

    it('unit image dragstart event store good data',()=>{
        ev.target=document.getElementsByTagName('img')[0];
        QOG.prototype.dragStartHandler(ev);
        expect(ev.dataTransfer).to.contain({"UnitName":"1st Patrol","NbUnits":1});
        expect(ev.dataTransfer.getData('fromZone')).to.equal("Siwa");
    });

    it('dragover stop propagation to allow drag & drop',()=>{
        ev.target=document.getElementsByTagName('img')[0];
        QOG.prototype.dragStartHandler(ev);
        ev.target=document.getElementsByTagName('area')[0];
        ev.preventDefault = sinon.spy();
        QOG.prototype.dropHandler(ev);
        expect(ev.preventDefault.called).to.be.true;
        
        ev.preventDefault=undefined;
    });


    it('drop handler move unit in the good place',()=>{
        const patrolImg = document.getElementsByTagName('img')[0];
        ev.target=patrolImg;
        QOG.prototype.dragStartHandler(ev);
        ev.preventDefault = sinon.spy();
        ev.target = document.getElementsByTagName('area')[0];
        QOG.prototype.dropHandler(ev);
        expect(ev.preventDefault.called).to.be.true;
        expect(gameManager.zones['Siwa'].units[0]).to.be.undefined;
        expect(gameManager.zones['Cross1'].units['1st Patrol']).to.equal(gameManager.units['1st Patrol']);
        expect(patrolImg.style.top).to.be.equal('105px');
        expect(patrolImg.style.left).to.be.equal('105px');
        ev.preventDefault=undefined;
    });
});