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

// 80% of the following tests won't be counted by c8 as they are performed under jsdom global env
// probably it would be interesting to remove QOG.mjs from test coverage 

describe ('[main QOG MJS] init functions work well',()=>{

    it('chooseScenario authorize to select a scenario and return his name to build url to json file',()=>{
        window = new JSDOM('',{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);
        globalThis.window = window;
        globalThis.alert = window.alert;
        globalThis.document = globalThis.window.document
        expect(()=>{QOG.prototype.chooseScenario(scenarList)}).to.not.throw();
        expect(()=>{QOG.prototype.chooseScenario()}).to.throw();
        expect(()=>{QOG.prototype.chooseScenario("scenarList")}).to.throw();
        expect(QOG.prototype.chooseScenario(scenarList).units).to.exist; 
        globalThis.document = globalThis.alert = globalThis.window = undefined
    });

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
        console.log(QOG.prototype.zones['Siwa'].Element);
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
        expect(imgs[1].getAttribute("draggable")).to.equal('true');
        expect(imgs[1].ondragstart).to.equal(QOG.prototype.dragStartHandler);
        let coords=QOG.prototype.zones['Siwa'].Element.coords;
        coords=coords.split(',');
        console.log(coords);
        expect(imgs[1].style.top).to.equal(Number(coords[1])+5+"px");
        expect(imgs[1].style.left).to.equal(Number(coords[0])+5+"px");
        globalThis.document = globalThis.window = undefined;
    });

    it('is possible tout initiate a scenario and all units with QOG',()=>{
        const json = JSON.parse(fs.readFileSync('./test/UnitTests/json/ScenarioTest.json','utf8'));
        QOG.prototype.units = [];
        expect(()=>{QOG.prototype.initScenario(json);}).to.not.throw;
        QOG.prototype.initScenario(json);
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
        globalThis.window = window;
        globalThis.document = window.document;
        globalThis.alert = window.alert;
        globalThis.XMLHttpRequest = window.XMLHttpRequest;

        expect (()=>{QOG.prototype.create()}).to.not.throw();
        expect (()=>{QOG.prototype.create('fierfeu')}).to.not.throw();

        server.restore();
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