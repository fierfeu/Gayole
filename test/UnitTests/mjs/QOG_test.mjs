import QOG from '../../../src/Client/mjs/QOG.mjs';
import unit from '../../../src/Client/mjs/unit.mjs';

import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import sinon from 'sinon';

var window;

const scenarList = '[{"name":"ScenarioTest","description":"Seul scénario disponible pour le moment"}]';

/*const boardGameTest = fs.readFileSync('./test/UnitTests/HTML/boardGameTest.html','utf8');
boardGameTest=boardGameTest.replace(/\s/g,"");*/

const QOGString = QOG.toString();
const HTML =    `<body>
                    <div id='GameBoard'>
                        <div id='dialogZone'>

                        </div>
                        <div id='strategicMap'>
                            
                        </div>
                    </div>      
                </body>`;

describe ('[main QOG MJS] init functions work well',()=>{
    beforeEach(()=>{
        
    });

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

    // the next functions are used as callback functions for xhr onload event
    it('is possible tout initiate boardGame for QOG',()=>{
        const context = 'var boardRequest = {"status":200,"responseText":"'+
            "<div id='dialogZone' class='dialogZone'></div>"+
            "<div id='strategicMap' class='strategicMap'>"+
                "<img src='/strategicMap.png'>"+
            "</div>"+
            '"}';
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        expect(()=>{window.eval(
            QOGString+";"+
            context+";"+
            "QOG.prototype.initBoardGame();"
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

    it('is possible tout initiate a scenario and all units with QOG',()=>{
        const json = fs.readFileSync('./test/UnitTests/json/ScenarioTest.json','utf8');
        const scenario = 'var jsonhttp = {"status":200}; jsonhttp.responseText =' + json + ';';

        const unitString = unit.toString();

        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);

        expect(()=>{window.eval(
            unitString +"\n"+
            QOGString+"\n "+
            scenario+
            "QOG.prototype.initScenario();"
        )}).to.not.throw();
        expect(window.eval(
            unitString +"\n"+
            QOGString+"\n "+
            scenario+
            "QOG.prototype.initScenario();"+
            "QOG.prototype.units")
        ).to.exist;
        expect(window.eval(
            unitString +"\n"+
            QOGString+"\n "+
            scenario+
            "QOG.prototype.initScenario();"+
            "QOG.prototype.units['1st Patrol'];")
        ).to.exist;
    });

    it('is possible to instanciate a new QOG object',()=>{
        const eventInterfaceString = "class eventStorageInterface {constructor (context,storage){this.context=context;this.storage=storage}}";
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "new QOG();"
        )}).to.not.throw();
        expect(window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "var qog = new QOG();"+
            "qog.myEventStorageInterface.storage;"
        )).to.equal('localStorage');
    });
});

describe('[main QOG MJS] Crete function works well',()=>{
    it('create function throw errors when bad usage',()=>{
        const eventInterfaceString = "class eventStorageInterface {constructor (context,storage){this.context=context;this.storage=storage}}";
        window = new JSDOM(HTML,{url:'http://localhost/',runScripts: 'dangerously'}).window;
        window.alert = window.console.log.bind(window.console);
        window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        const server = sinon.fakeServer.create();

        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "var qog = new QOG();"+
            "qog.create();"
        )}).to.not.throw();
        expect(()=>{window.eval(
            eventInterfaceString+"\n"+
            QOGString+"\n "+
            "var qog = new QOG();"+
            "qog.create('fierfeu');"
        )}).to.not.throw();

        server.restore();
    });
});