import EPT from '../../../../src/Client/mjs/EPT.mjs';
import unit from '../../../../src/Client/mjs/unit.mjs';
import {unitSet} from '../../../../src/Client/mjs/unitSet.mjs';
import zone from '../../../../src/Client/mjs/zone.mjs';
import scenario from '../../../../src/Client/mjs/scenario.mjs';
import game from '../../../../src/Client/mjs/game.mjs';

import fs from 'fs';
import chai from 'chai';
const expect = chai.expect;
import jsdom from 'jsdom';
const {JSDOM} = jsdom;
import sinon from 'sinon';
import { promise } from 'selenium-webdriver';
import { it } from 'mocha';

const EMPTYHTML = `<html>
                        <body>
                            <div id='gameBoard' class='gameBoardHide' >
                                <div id='dialogZone' class='dialogZone'>
                                </div>
                                <div id='strategicMap' class='strategicMap'>
                                </div>
                            </div>
                        </body>
                    </html>`

const EPTScenarioTestList =[["Default Scenario","This is the first scenario to learn how to play","/EPT_scenario_default.json"],["Scenarii for OCDT", ["first recognition","perform a recognition in first line","/EPT_OCDT-Rcegnition.json"]]]
const scenarioTest = `
{
    "description": {
        "name": "Default Scenario",
        "long":"longue description of the defaultscenario",
        "short":"This is the first scenario to learn how to play",
        "date" :"5/05/1940"
    },
    "maps" : {
        "nb":1,
        "desc":[["A.html",0]] 
    },
    "opponents":[
        {
            "player":"FR",
            "nom":"Français",
            "Corp":"1 GRDI",
            "CorpTxt":"1st Recognition Group platoon",
            "units": [
                {"type":"CP","level":"Platton","unitName":"Pithiviers","FP":2,"RoF":6,"range":3,"Face":0,"Hesitant":[2,3],"Morale":7},
                {"type":"SQ","PlatoonName":"Pithiviers","unitName":"A","FP":[4,3],"RoF":6,"range":4,"Morale":7},
                {"type":"SQ","PlatoonName":"Pithiviers","unitName":"B","FP":[4,3],"RoF":6,"range":4,"Morale":7},
                {"type":"SQ","PlatoonName":"Pithiviers","unitName":"C","FP":[4,3],"RoF":6,"range":4,"Morale":7},
                {"type":"DY","Nb":1}
            ]
        },
        {
            "player":"DE",
            "nom":"German",
            "Corp":"7 PanzerDivision"
        }
    ],
    "victoryConditions":{}
}
`
const scenarioTestOCDT = `
{
    "description": {
        "name": "Default Scenario",
        "long":"longue description of the defaultscenario",
        "short":"This is the first scenario to learn how to play"
    },
    "maps" : {
        "nb":2,
        "desc":[["A.html",0],["B.html",1]]
    },
    "opponents":{},
    "victoryConditions":{}
}`

const mapXHTML =`
<div id='map0'>
    <img id='mapX' src='mapX.png'>
    <script>
        var mapData =[]
        mapData['mapX'] = {
            "description":"Ouest Europe",
            "width":6613,
            "height": 4745,
            "radius" : 276,
            "hexs":[
                {"id":"0101","center":[0,224],"terrain":0,"bordure":0,"elevation":0,"batiment":0,"area":[[144,0],[280,224],[144,460],[0,460],[0,0]]},
                {"id":"0503","center":[1659,1185],"terrain":0,"bordure":0,"elevation":0,"batiment":0,"area":[[1792,941],[1934,1179],[1792,1418],[1518,1418],[1382,1179],[1518,941]]},
                {"id":"0603","center":[2063,950],"terrain":0,"bordure":0,"elevation":0,"batiment":0,"area":[[2206,700],[2348,941],[2206,1179],[1934,1179],[1792,941],[1934,700]]},
                {"id":"0604","center":[2063,1430],"terrain":3,"bordure":{"type":3,"separate":["0503","0504","0603"]},"elevation":0,"batiment":0,"area":[[2206,1179],[2348,1418],[2206,1656],[1934,1656],[1792,1418],[1934,1179]]},
                {"id":"0605","center":[2063,1910],"terrain":0,"bordure":0,"elevation":0,"batiment":1,"area":[[2206,1656],[2348,1893],[2206,2133],[1934,2133],[1792,1893],[1934,1656]]},
                {"id":"0704","center":[2478,1665],"terrain":0,"bordure":0,"elevation":0,"batiment":2,"area":[[2626,1418],[2762,1656],[2626,1893],[2348,1893],[2206,1656],[2348,1418]]}
            ]

        }
    </script>
</div>
<div id='map1'>
    <img id='mapX2' src='mapX.png'>
    <script>
        mapData['mapX2'] = {
            "description": "Ouest Europe map2",
            "width":6613,
            "height": 4745,
            "radius" : 276,
            "hexs":[
                {"id":"0101","center":[0,224],"terrain":0,"bordure":0,"elevation":0,"batiment":0,"area":[[144,0],[280,224],[144,460],[0,460],[0,0]]},
                {"id":"0503","center":[1659,1185],"terrain":0,"bordure":0,"elevation":0,"batiment":0,"area":[[1792,941],[1934,1179],[1792,1418],[1518,1418],[1382,1179],[1518,941]]},
                {"id":"0603","center":[2063,950],"terrain":0,"bordure":0,"elevation":0,"batiment":0,"area":[[2206,700],[2348,941],[2206,1179],[1934,1179],[1792,941],[1934,700]]},
                {"id":"0604","center":[2063,1430],"terrain":3,"bordure":{"type":3,"separate":["0503","0504","0603"]},"elevation":0,"batiment":0,"area":[[2206,1179],[2348,1418],[2206,1656],[1934,1656],[1792,1418],[1934,1179]]},
                {"id":"0605","center":[2063,1910],"terrain":0,"bordure":0,"elevation":0,"batiment":1,"area":[[2206,1656],[2348,1893],[2206,2133],[1934,2133],[1792,1893],[1934,1656]]},
                {"id":"0704","center":[2478,1665],"terrain":0,"bordure":0,"elevation":0,"batiment":2,"area":[[2626,1418],[2762,1656],[2626,1893],[2348,1893],[2206,1656],[2348,1418]]}
            ]

        }
    </script>
</div>
`
describe('[EPT for gameManager] EPT prototype content good gameManager Interface', ()=>{

    it('EPT prototype is defined', () => {
        expect(EPT.prototype).to.not.be.undefined;
    });


    it('has boards function',()=>{
        expect(EPT.prototype.boards).to.exist;
        expect(typeof EPT.prototype.boards).to.equal('function');
        expect(EPT.prototype.boards.constructor.name).to.equal('AsyncFunction')
        // verify sub functions called by boards
        expect(EPT.prototype.rankVerification).to.exist
        expect(typeof EPT.prototype.rankVerification).to.equal('function')
        expect(EPT.prototype.scenarioSelection).to.exist
        expect(typeof EPT.prototype.scenarioSelection).to.equal('function')
        expect(EPT.prototype.scenarioSelection.constructor.name).to.equal('AsyncFunction')
        expect(EPT.prototype.loadMaps).to.exist
        expect(typeof EPT.prototype.loadMaps).to.equal('function')
        expect(EPT.prototype.initZones).to.exist
        expect(typeof EPT.prototype.initZones).to.equal('function')
    });

    it('has setUp function',()=>{
        expect(EPT.prototype.setUp).to.exist;
        expect(typeof EPT.prototype.setUp).to.equal('function');
    });

    it('has getGameName function',()=>{
        expect(EPT.prototype.getGameName).to.exist;
        expect(typeof EPT.prototype.setUp).to.equal('function');
    });

    it('getGameName return EPT as game name', () => {
        expect(EPT.prototype.getGameName()).equal('EPT');
    })

    it ('running function exist', () => {
        expect(EPT.prototype.run).to.exist
        expect(typeof EPT.prototype.run).to.equal('function')
    })

    it('throw "EPT not intantaible" when trying to create an instance of EPT', () => {
        expect(() => {new EPT}).to.throw('EPT interface not Instantiable')
    })

})

describe('[EPT for gameManager] EPT boards manage player ranking and initiate boards and zones', () => {
    // set contextual gameManager
    const gameManager = {
        loadExternalRessources () {}
    }
     let verifRank,verifScenar,verifLoad,verifInitZones

    beforeEach(()=>{
        verifRank = sinon.stub(EPT.prototype,'rankVerification')
        verifScenar = sinon.stub(EPT.prototype,'scenarioSelection')
        verifLoad = sinon.stub(EPT.prototype,'loadMaps')
        verifInitZones = sinon.stub(EPT.prototype,'initZones')
    })

    afterEach(()=>{
        verifInitZones.restore()
        verifLoad.restore()
        verifScenar.restore()
        verifRank.restore()
    })


    it('boards call player rank verification function',() => {

        EPT.prototype.boards.call(gameManager)
        expect(verifRank.calledOnce).to.true

    })

    it('boards call scenario selection function with player rank', ()=>{
        const player={'rank':0}

        EPT.prototype.boards.call(gameManager,player)

        expect(verifScenar.calledOnce).to.true
        expect(verifScenar.calledImmediatelyAfter(verifRank)).to.true
        expect(verifScenar.calledWith(player.rank)).to.true

    })

    it('boards call loadMaps function with maps ref list acocrding to selected scenario', async () => {

        verifScenar.returns(Promise.resolve())

        await EPT.prototype.boards.call(gameManager)

        expect(verifLoad.calledOnce).to.true
        expect(verifLoad.calledImmediatelyAfter(verifScenar)).to.true

    })

    it('boards call initzones function', async () => {
        verifScenar.returns(Promise.resolve())

        await EPT.prototype.boards.call(gameManager)
        expect(verifInitZones.calledOnce).to.true
        expect(verifInitZones.calledImmediatelyAfter(verifLoad)).to.true
        expect(verifInitZones.calledWith(gameManager)).to.true

    })
})

describe('[EPT gameInterface] scenarioSelection function allow to select and load scenario and return boards to load', ()=>{

    //maps.desc = file to load + orientation with O:horizontal & 1:vertical
        
    beforeEach(()=>{
        globalThis.gameManager={}
        gameManager.loadExternalRessources = (opts)=>{
            return new Promise((resolve) =>{resolve(opts.url)})
        }
        
    })
    it('for player.rank=-1 load default scenario and store is name in gameManager.currentScenarioName',()=>{
        const player={'rank':-1}
        const verifLoader = sinon.stub(gameManager,'loadExternalRessources')
        expect (() =>{EPT.prototype.scenarioSelection.call(gameManager, player.rank)}).to.not.throw()
        expect(verifLoader.calledOnce).to.true
        expect(verifLoader.calledWith({'url':EPTScenarioTestList[0][2]})).to.true
        expect(gameManager.currentScenarioName).to.equal(EPTScenarioTestList[0][0])
        verifLoader.restore()
    })

    it('for player.rank >0 call select scenario function to retrieve scenario and store is name',()=>{
        const player={'rank':1} // first level as OCDT
        const verifLoader = sinon.stub(gameManager,'loadExternalRessources')
        expect (() =>{EPT.prototype.scenarioSelection.call(gameManager, player.rank)}).to.not.throw()
        expect(verifLoader.calledOnce).to.true
        expect(verifLoader.calledWith({'url':EPTScenarioTestList[player.rank][1][2]})).to.true
        expect(gameManager.currentScenarioName).to.equal(EPTScenarioTestList[player.rank][1][0])
        verifLoader.restore()
    })

    it('store scenario content in gameManager.currentScenarioDescriptor', async ()=>{
        const player={'rank':-1}
        await EPT.prototype.scenarioSelection.call(gameManager, player.rank)
        expect(gameManager.currentScenarioDescriptor).to.equal(EPTScenarioTestList[0][2])
    })

    it('store maps in current Scenario Descriptor', async () => {
        const player = {'rank':-1}
        gameManager.loadExternalRessources = (opts)=>{
            return new Promise((resolve) =>{resolve(scenarioTest)})
        }
        const resultMaps = JSON.parse(scenarioTest).maps
        await EPT.prototype.scenarioSelection.call(gameManager,player.rank)
        expect(gameManager.currentScenarioDescriptor.maps).to.eql(resultMaps)
    })

})

describe('Load maps store maps image in boardgame', () => {
    beforeEach(() => {
        globalThis.gameManager={}
        globalThis.window = new JSDOM(EMPTYHTML).window
        globalThis.document = window.document
    });

    afterEach(() => {
        globalThis.window = undefined
        globalThis.document=undefined
        globalThis.gameManager=undefined
    });
    it('with player.rank=-1, put maps html in window strategicmap div', async () => {
        //arrange
        const player = {'rank':-1}
        gameManager.loadExternalRessources = ()=>{
            return new Promise((resolve) =>{resolve(scenarioTest)})
        }
        await EPT.prototype.scenarioSelection.call(gameManager, player.rank)
        gameManager.loadExternalRessources = (opts)=>{
            return new Promise((resolve) =>{resolve("<img src='"+opts.url+"'>")})
        }
        //act
        await EPT.prototype.loadMaps.call(gameManager)
        //assert
        const strategicMap = document.getElementById('strategicMap')
        const divs = strategicMap.getElementsByTagName('div')
        expect(divs.length).to.equal(1)
        expect(divs[0].id).to.equal('map0')
        const imgs = divs[0].getElementsByTagName('img')
        expect(imgs.length).to.equal(1)
        const maps = JSON.parse(scenarioTestOCDT).maps
        expect(divs[0].innerHTML).to.equal('<img src="'+maps.desc[0][0]+'">')
    });

    it('with rank player = OCDT, strategicMap html contains 2 maps', async () => {
        //arrange
        const player = {'rank':1}
        gameManager.loadExternalRessources = ()=>{
            return new Promise((resolve) =>{resolve(scenarioTestOCDT)})
        }
        await EPT.prototype.scenarioSelection.call(gameManager, player.rank)
        gameManager.loadExternalRessources = (opts)=>{
            return new Promise((resolve) =>{resolve('<img src="'+opts.url+'">')})
        }
        //act
        await EPT.prototype.loadMaps.call(gameManager)
        //assert
        const strategicMap = document.getElementById('strategicMap')
        const divs=strategicMap.getElementsByTagName('div')
        const maps = JSON.parse(scenarioTestOCDT).maps
        expect(divs.length).to.equal(2)
        expect(divs[0].id).to.equal('map0')
        expect(divs[1].id).to.equal('map1')
        const imgs = strategicMap.getElementsByTagName('img')
        expect(imgs.length).to.equal(2)
        expect(divs[0].innerHTML).to.equal('<img src="'+maps.desc[0][0]+'">')
        expect(divs[1].innerHTML).to.contains('<img src="'+maps.desc[1][0]+'"')
    });

    it('laodMaps manage orientation of maps', async () => {
        //arrange
        const player = {'rank':1}
        gameManager.loadExternalRessources = ()=>{
            return new Promise((resolve) =>{resolve(scenarioTestOCDT)})
        }
        await EPT.prototype.scenarioSelection.call(gameManager, player.rank)
        gameManager.loadExternalRessources = (opts)=>{
            return new Promise((resolve) =>{resolve('<img src="'+opts.url+'">')})
        }
        //act
        await EPT.prototype.loadMaps.call(gameManager)
        await EPT.prototype.loadMaps.call(gameManager)
        //assert
        const imgs = document.getElementsByTagName('img')
        const maps = JSON.parse(scenarioTestOCDT).maps
        for (let index = 0; index < maps.nb; index++) {
            const element = maps.desc[index][0];
            const orientation=maps.desc[index][1]
            if(orientation===0)
                expect(imgs[index].className).to.equal('')
            else
                expect(imgs[index].className).to.equal('verticalMap')
        }
    });
});

describe('[EPT-Game Creation]Load data from mapX.html', () => {
    it('load script from loadexternalressources', async () => {
        const window = new JSDOM(mapXHTML,{runScripts: "dangerously" }).window
        globalThis.document = window.document
        const gameManager={
            'currentScenarioDescriptor':{
                'maps':{
                    'nb':1,
                    'desc':[['mapX.html',0]]
                }
            }
        }

        expect(window.eval("mapData['mapX']")).to.exist
        expect(window.eval("mapData['mapX'].description")).to.equal('Ouest Europe')

        globalThis.document=undefined
    });

    it('Init zones load maps data in currentScenarioDescriptor.maps.data[0] for one maps', () => {
        const gameManager={
            'currentScenarioDescriptor':{
                'maps':{
                    'nb':1,
                    'desc':[['mapX.html',0]]
                }
            }
        }
        globalThis.window = new JSDOM(mapXHTML,{runScripts: "dangerously" }).window
        globalThis.document = window.document

        EPT.prototype.initZones.call(gameManager)

        expect(gameManager.currentScenarioDescriptor.maps.data).to.exist
        expect(gameManager.currentScenarioDescriptor.maps.data[0].description).to.equal('Ouest Europe')

        globalThis.window=undefined
        globalThis.document=undefined
    });

    it('Init zones load maps data in currentScenarioDescriptor.maps.data[0] and [1] for two maps', () => {
        const gameManager={
            'currentScenarioDescriptor':{
                'maps':{
                    'nb':2,
                    'desc':[['mapX.html',0],['mapX.html',0]]
                }
            }
        }
        globalThis.window = new JSDOM(mapXHTML,{runScripts: "dangerously" }).window
        globalThis.document = window.document

        EPT.prototype.initZones.call(gameManager)

        expect(gameManager.currentScenarioDescriptor.maps.data).to.exist
        expect(gameManager.currentScenarioDescriptor.maps.data[0].description).to.equal('Ouest Europe')
        expect(gameManager.currentScenarioDescriptor.maps.data[1].description).to.equal('Ouest Europe map2')
        
        globalThis.window=undefined
        globalThis.document=undefined
    });
});

describe('[EPT Game Prototype] init Zones initialises area for maps', () => {
    it('initialise area for one map', () => {
        const gameManager={
            'currentScenarioDescriptor':{
                'maps':{
                    'nb':1,
                    'desc':[['mapX.html',0]],
                    'data':[]
                }
            }
        }
        globalThis.window = new JSDOM(mapXHTML,{runScripts: "dangerously" }).window
        globalThis.document = window.document

        EPT.prototype.initZones.call(gameManager)

        const img = document.getElementById('mapX')
        expect(img.useMap).to.equal('#map0areas')
        expect(document.getElementById('map0areas')).to.exist
        const area0101 = document.getElementById('0101')
        expect(area0101).to.exist
        expect(area0101.tagName).to.equal('AREA')
        expect(area0101.shape).to.equal('poly')
        expect(area0101.coords).to.equal("144,0,280,224,144,460,0,460,0,0")
        const area0704 = document.getElementById('0704')
        expect(area0704).to.exist
        expect(gameManager.zones).to.exist
        expect(gameManager.zones['0101']).to.exist
        expect(gameManager.zones['0604'].terrain).to.equal(3)
        expect(gameManager.zones['0101']instanceof zone).to.be.true

        globalThis.window = undefined
        globalThis.document = undefined
    });
});

describe('[EPT Game Prototype] init events according to current phase', () => {
    it('current phase is Initiate', () => {
        const gameManager={
            'currentScenarioDescriptor':{
                'maps':{
                    'nb':1,
                    'desc':[['mapX.html',0]],
                    'data':[]
                }
            }
        }
        globalThis.window = new JSDOM(mapXHTML,{runScripts: "dangerously" }).window
        globalThis.document = window.document

        EPT.prototype.initZones.call(gameManager)

        expect(gameManager.currentGamePhase).to.equal('Initiate')

        globalThis.window = undefined
        globalThis.document = undefined
    });

    it('EPT prototype has Over and drop event Handler', () => {
        expect(EPT.prototype.zoneOverHandler).to.exist
        expect(typeof EPT.prototype.zoneOverHandler).to.equal('function')
        expect(EPT.prototype.zoneDropHandler).to.exist
        expect(typeof EPT.prototype.zoneDropHandler).to.equal('function')
    });

    it('add event listener for over, touch and drop zone', () => {
        const gameManager={
            'currentScenarioDescriptor':{
                'maps':{
                    'nb':1,
                    'desc':[['mapX.html',0]],
                    'data':[]
                }
            }
        }
        globalThis.window = new JSDOM(mapXHTML,{runScripts: "dangerously" }).window
        globalThis.document = window.document
        const verifOver = sinon.stub(EPT.prototype,'zoneOverHandler')
        const verifDrop = sinon.stub(EPT.prototype,'zoneDropHandler')

        EPT.prototype.initZones.call(gameManager)

        const area = document.getElementById('0101')
        const MOUSEOVER = new window.Event('mouseover');
        const DROP = new window.Event("drop")
        area.dispatchEvent(MOUSEOVER)
        expect(verifOver.calledOnce).to.true
        area.dispatchEvent(DROP)
        expect(verifDrop.calledOnce).to.true


        globalThis.window = undefined
        globalThis.document = undefined
    });
});

//task : add units to gameboard https://todoist.com/showTask?id=7068264534
describe('[EPT GAME PROTO] setUp works well', () => {
    it('EPT prototype has the good function for setUp',()=>{
        expect(EPT.prototype.setOpponents).to.exist
        expect(typeof EPT.prototype.setOpponents).to.equal('function')
        expect(EPT.prototype.createUnits).to.exist
        expect(typeof EPT.prototype.createUnits).to.equal('function')
        expect(EPT.prototype.placeUnits).to.exist
        expect(typeof EPT.prototype.placeUnits).to.equal('function')
    })

    it('called with the good sequence : Opponent, create, place', ()=>{
        const verifSetOpp = sinon.stub(EPT.prototype,'setOpponents')
        const verifCreate = sinon.stub(EPT.prototype,'createUnits')
        const verifPlace = sinon.stub(EPT.prototype,'placeUnits')
        const gameManager = {'data':'loaded'}

        EPT.prototype.setUp.call(gameManager)

        expect(verifSetOpp.calledOnce).to.true
        expect(verifSetOpp.thisValues[0].data).to.be.equal('loaded')
        expect(verifCreate.calledOnce).to.true
        expect(verifCreate.calledImmediatelyAfter(verifSetOpp)).to.be.true
        expect(verifCreate.thisValues[0].data).to.be.equal('loaded')
        expect(verifPlace.calledOnce).to.true
        expect(verifPlace.calledImmediatelyAfter(verifCreate)).to.be.true
        expect(verifPlace.thisValues[0].data).to.be.equal('loaded')

        verifCreate.restore()
        verifPlace.restore()
        verifSetOpp.restore()
    })
//define opponents side and store data
describe('[EPT GAME PROTO] set Opponents data and initiate game opponents', () => {
    it('read opponents from scenario and create them in game manager', () => {
        const gameManager = {}
        const player ={
            "name":"testplayer",
            "country":"FR"
        }
        gameManager.currentScenarioDescriptor = JSON.parse(scenarioTest)

        EPT.prototype.setOpponents.call(gameManager,player)

        expect(gameManager.opponents).to.exist
        expect(gameManager.opponents.length).to.be.equal(2)
        expect(gameManager.opponents[0].player).to.be.equal("testplayer")
    });
});
});