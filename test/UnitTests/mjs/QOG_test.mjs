import QOG from '../../../src/Client/mjs/QOG.mjs';

import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;

var window;

const scenarList = '[{"name":"ScenarioTest","description":"Seul scénario disponible pour le moment"}]';
const boardGameTest = fs.readFileSync('./test/UnitTests/html/boardGameTest.html','utf8');
boardGameTest.replace(/\s/g,"");
const QOGString = QOG.toString();
const HTML =    `<body>
                    <div id='GameBoard'>
                        <div id='dialogZone'>

                        </div>
                        <div id='strategicMap'>
                            
                        </div>
                    </div>      
                </body>`;

describe ('[main QOG JS] init functions work well',()=>{
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

    // the enxt functions are use as callback function for xhr onload event
    it('is possible tout initiate boardGame for QOG',()=>{
        const context = 'var boardRequest = {"status":200,"responseText":"'+
            "<div id='dialogZone' class='dialogZone'></div>"+
            "<div id='strategicMap' class='strategicMap'>"+
                "<img src='/strategicMap.png' style='width:1100px;'>"+
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
/*
        const strategicMap = gameDiv.getElementsByTagName('div')[1];
        expect (window.eval(
            "const stratMap = document.getElementById('GameBoard').getElementsByTagName('div')[1]"
            strategicMap.getElementsByTagName('img')).to.exist;
        expect (strategicMap.getElementsByTagName('img')[0].src).to.equal('http://localhost/strategicMap.png');
        expect (strategicMap.getElementsByTagName('img')[0].style.width).to.equal('1100px');*/
    });
});