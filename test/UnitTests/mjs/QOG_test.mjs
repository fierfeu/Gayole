import QOG from '../../../src/Client/mjs/QOG.mjs';
import unit from '../../../src/Client/mjs/unit.mjs';
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
const scenarioString = scenario.toString();
const ZONEString = zone.toString();
const unitString = unit.toString();
const HTML =    `<body>
                    <div id='gameBoard'>
                        <div id='dialogZone'>

                        </div>
                        <div id='strategicMap'>
                            
                        </div>
                    </div>      
                </body>`;

describe ('[main QOG MJS] init functions work well',()=>{

    it('chooseScenario authorize to select a scenario and return his name to build url to json file',()=>{
        window = new JSDOM('',{url:'http://localhost/'}).window;
        globalThis.window = window;
         globalThis.document = globalThis.window.document;
        let mockedSelect = sinon.mock(scenario.prototype).expects('select').once();
    
        expect(()=>{QOG.prototype.chooseScenario()}).to.throw();
        expect(()=>{QOG.prototype.chooseScenario("scenarList")}).to.throw(); 
        expect(()=>{QOG.prototype.chooseScenario(scenarList)}).to.not.throw();
        expect(mockedSelect.verify()).to.true;
        expect (window.currentScenario.scenarii).to.equal(scenarList);

        globalThis.document = globalThis.alert = globalThis.window = undefined
    });

    it('is possible to initiate, on client side, the game zones with global',()=>{
        const HTML = "<div id='strategicMap' class='strategicMap'>"+
                        "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>"+
                        "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
                        "</map><img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'></div>";

        window = new JSDOM(HTML,{url:'http://localhost/'}).window;
        globalThis.window = window;
        globalThis.document = globalThis.window.document;
        expect (()=>{QOG.prototype.initZones()}).to.not.throw();
        expect (QOG.prototype.zones['Siwa'] instanceof zone).to.be.true;
        expect (QOG.prototype.zones['Siwa'].moveAllowedTo(QOG.prototype.zones['Cross1'])).to.be.equal('1');
        expect (QOG.prototype.zones['Cross1'].moveAllowedTo(QOG.prototype.zones['Siwa'])).to.be.equal('1');
        expect (QOG.prototype.zones['Cross1'].Element.ondragover).to.be.equal(QOG.prototype.dragOverHandler);
        expect (QOG.prototype.zones['Cross1'].Element.ondrop).to.be.equal(QOG.prototype.dropHandler);
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
        window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        expect(()=>{window.eval(
            QOGString+";"+
            ZONEString+"\n"+
            scenarioString+"\n"+
            unitString+"\n"+
            context+";"+
            "QOG.prototype.initBoardGame.call(boardRequest);"
        )}).to.not.throw();
        expect(window.eval("document.getElementById('gameBoard').style.display")).to.equal('block');
        expect(window.eval(
            "document.getElementById('gameBoard').getElementsByTagName('div')[1]")).to.exist;
        expect(window.eval(
            "document.getElementById('gameBoard').getElementsByTagName('div')[0].id")).to.equal('dialogZone');
        expect(window.eval(
            "document.getElementById('gameBoard').getElementsByTagName('div')[1].id")).to.equal('strategicMap');
        expect(window.eval(
            "const stratMap = document.getElementById('gameBoard').getElementsByTagName('div')[1];"+
            "stratMap.getElementsByTagName('img');"
        )).to.exist;
        expect(window.eval(
            "const stratMap = document.getElementById('gameBoard').getElementsByTagName('div')[1];"+
            "stratMap.getElementsByTagName('img')[0].src;"
        )).to.equal('http://localhost/strategicMap.png');
    });

    it('is possible to place units on board',()=>{
        const boardHTML = "<div id='strategicMap' class='strategicMap'>"+
                        "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>"+
                        "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
                        "</map><img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'></div>";
        
        const jsonZoneDesc ={"Siwa":"1st Patrol"};
        const unitDesc = {"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol","description":"my first patrol in game"}; 
        window = new JSDOM(boardHTML,{url:'http://localhost/'}).window;
        globalThis.window = window;
        globalThis.document = globalThis.window.document;
        QOG.prototype.units = [];
        QOG.prototype.units['1st Patrol'] = new unit (
            unitDesc.images,
            unitDesc.name,
            unitDesc.description
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
        expect(imgs[1].getAttribute("draggable")).to.equal('true');
        expect(imgs[1].ondragstart).to.equal(QOG.prototype.dragStartHandler);
        let coords=QOG.prototype.zones['Siwa'].Element.coords;
        coords=coords.split(',');
        expect(imgs[1].style.top).to.equal(Number(coords[1])+5+"px");
        expect(imgs[1].style.left).to.equal(Number(coords[0])+5+"px");
        globalThis.document = globalThis.window = undefined;
    });

    it('is possible tout initiate a scenario and all units with QOG',()=>{
        const dataObject = JSON.parse(fs.readFileSync('./test/UnitTests/json/ScenarioTest.json','utf8'));
        const boardHTML = "<div id='strategicMap' class='strategicMap'>"+
            "<map name='gameBoardMap'><area shape='rect' id='Siwa' data-links='Cross1:1' coords='685,457,726,500'>"+
            "<area shape='rect' id='Cross1' data-links='Siwa:1' coords='674,386,714,426' title='Crossing zone'>"+
            "</map><img src='/strategicMap.png' style='width:1100px;'usemap='#gameBoardMap'></div>";
        window = new JSDOM(boardHTML,{url:'http://localhost/'}).window;
        globalThis.currentScenario = new scenario(scenarList);
        globalThis.document = window.document;
        QOG.prototype.units=[];
        let mockedPlaceUnits = sinon.mock(QOG.prototype).expects('placeUnits').once().withArgs({"Siwa":"1st Patrol"});

        expect(()=>{QOG.prototype.initScenario(dataObject);}).to.not.throw();
        expect(QOG.prototype.units['1st Patrol']).to.exist;
        expect(QOG.prototype.units['1st Patrol'].images['recto']).to.equal("/patrol1.png");
        expect(mockedPlaceUnits.verify()).to.true;

        globalThis.currentScenario=undefined;
        globalThis.document=undefined;
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

describe('[main QOG MJS] scenario parser works well',()=>{
    const goodData = {
        "description":{
            "name":"testName",
            "long":"longue description", // beware not multilingue !
            "short":"short desc"
        },
        "LRDG":{"units":"test","detachments":"test","patrols":"test","localisations":{"Siwa":"test"}},
        "Axis":{"units":"test","detachments":"test","patrols":"test","localisations":""},
        "conditions":{
            "roundNb": 1,
            "returnZone" :["Siwa"],
            "victoryTest":"()=>{return true}"
        }
    };

    beforeEach(()=>{
        globalThis.currentScenario = new scenario(scenarList);
    });

    afterEach (()=>{
        globalThis.currentScenario = undefined;
    });

    it('is possible to call scenario parser with data object',()=>{
        
        const data={"value":"toVerify"};
        expect (()=>{QOG.prototype.scenarioParser()}).to.throw('ERROR no scenario data to parse : no scenario initiated');
        expect (()=>{QOG.prototype.scenarioParser("whatEverExceptGood")}).to.throw('ERROR badly formated scenario data to parse: no scenario initiated');
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: ');
        expect (()=>{QOG.prototype.scenarioParser(goodData)}).to.not.throw();
        
    });
    // at first level of keys a good scenario descriptor file must contains : a description zone, a victoryconditions zone and 2 opponents zones: (LRDG & Axis)

    it('has a good "description" zone parser',()=>{
        let data ={"value":"test"};
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no scenario description Object');
        data = {"description":"test","conditions":"test","LRDG":"test","Axis":"test"};
        expect (()=>{QOG.prototype.scenarioParser(data)}).to.throw('ERROR badly formated object : keys are missing: no scenario name in description');
        // no ERROR for long and short as they are not yet mandatory
        QOG.prototype.scenarioParser(goodData);
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
        QOG.prototype.scenarioParser(goodData);
        let scenar = currentScenario;
        expect(scenar.hasOwnProperty('conditions')).to.true;
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
        QOG.prototype.scenarioParser(goodData);
        let scenar = currentScenario;
        expect(currentScenario.hasOwnProperty('opponent')).to.true;
        //expect(QOG.prototype.scenario).to.have.key('opponent');
        expect(scenar.opponent[0]).to.equal(2);
        expect(scenar.opponent[1][0]).to.equal('LRDG');
        expect(scenar.opponent[2][0]).to.equal('Axis');
        let LRDG = scenar.opponent[1][1];
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

});

describe('[main QOG MJS] Create function works well',()=>{
    it('create function throw errors when bad usage',()=>{
        const eventInterfaceString = "class eventStorageInterface {constructor (context,storage){this.context=context;this.storage=storage}}";
        window = new JSDOM(HTML,{url:'http://localhost/'}).window;
        window.alert = window.console.log.bind(window.console);
        window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        globalThis.window = window;
        globalThis.document = window.document;
        globalThis.alert = window.alert;
        globalThis.XMLHttpRequest = window.XMLHttpRequest;

        expect (()=>{QOG.prototype.create()}).to.not.throw();
        expect (()=>{QOG.prototype.create('fierfeu')}).to.not.throw();

        globalThis.window = globalThis.document = globalThis.alert = globalThis.XMLHttpRequest= undefined;
    });
});

describe('[QOG drag&drop] is possible to move a unit to a zone linked',() =>{
    let ev ={dataTransfer:{}};
    beforeEach (()=>{
        globalThis.document = new JSDOM('<mapname="mappy"><area id="Cross1" shape="rect" coords="100,100,200,200"> </map>'+
            '<img name="1st Patrol" usemap="#mappy" style="position:absolute;top:520px;left:694px;" src="/patrol.png">',
            {pretendToBeVisual:true}).window.document;
        const scenario = {"units":[{"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol","description":"my first patrol in game"}]};
        QOG.prototype.units = [];
        QOG.prototype.units['1st Patrol'] = new unit (
            scenario.units[0].images,
            scenario.units[0].name,
            scenario.units[0].description );
        QOG.prototype.zones=[];
        QOG.prototype.zones['Siwa'] = new zone(document.getElementsByTagName('area')[0],'Siwa');
        QOG.prototype.zones['Cross1']= new zone(document.getElementsByTagName('area')[0],'Cross1');
        QOG.prototype.zones['Siwa'].linkTo(QOG.prototype.zones['Cross1'],1);
        QOG.prototype.zones['Cross1'].linkTo(QOG.prototype.zones['Siwa'],1);
        QOG.prototype.zones['Siwa'].attach(QOG.prototype.units['1st Patrol']);
        ev.dataTransfer.setData = (key,value) => { ev.dataTransfer[key]=value};
        ev.dataTransfer.getData = (key) => {return ev.dataTransfer[key]};
    });

    it('unit image dragstart event store good data',()=>{
        ev.target=document.getElementsByTagName('img')[0];
        QOG.prototype.dragStartHandler(ev);
        expect(ev.dataTransfer).to.contain({"UnitName":"1st Patrol","NbUnits":1});
        expect(ev.dataTransfer.getData('fromZone')).to.equal("Siwa");
    });

    it('dragOver & drop handlers stop propagation and give info on movement availability',()=>{
        ev.target=document.getElementsByTagName('img')[0];
        QOG.prototype.dragStartHandler(ev);
        ev.target=document.getElementsByTagName('area')[0];
        ev.preventDefault = sinon.spy();
        QOG.prototype.dragOverHandler(ev);
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
        expect(QOG.prototype.zones['Siwa'].units[0]).to.be.undefined;
        expect(QOG.prototype.zones['Cross1'].units['1st Patrol']).to.equal(QOG.prototype.units['1st Patrol']);
        expect(patrolImg.style.top).to.be.equal('105px');
        expect(patrolImg.style.left).to.be.equal('105px');
        ev.preventDefault=undefined;
    });
});