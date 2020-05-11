import eventStorageInterface from './eventStorageInterface.mjs';
import eventManager from './eventManager.mjs';
import unit from './unit.mjs';
import zone from './zone.mjs';

var jsonhttp,boardRequest;

export default class QOG {
    constructor () {
        this.myEventStorageInterface = new eventStorageInterface(window,'localStorage');
    }

    create (user) {
        window.localStorage.setItem('gameLaunched','QOG');
        if(user) {
            window.localStorage.setItem('user','user');
        }
        if (!XMLHttpRequest) throw "ERROR you can't play Gayole with your current browser : sorry";
        const boardRequest = new XMLHttpRequest();
        boardRequest.onload = this.initBoardGame;
        const url = "/QOG_boardGame.html";
        boardRequest.open("GET", url);
        boardRequest.send();
        this.loadScenario(this.chooseScenario([{"name":"default"}]));
        
    }

    initBoardGame () {
        if((this.status >= 200 || this.status < 300) && (this.responseText != null)) 
        {
            // the following code is for explanatory stuff only
            document.getElementById('strategicMap').onmousemove = (event) =>{
                document.getElementById('dialogZone').innerHTML
            };
            document.getElementById('GameBoard').innerHTML = this.responseText;
            document.getElementById('GameBoard').style.display="inline";
            
            QOG.prototype.zones=[];
        }
    }

    chooseScenario(liste) {
        if(!liste || !Array.isArray(liste)) throw 'ERROR QOG.chooseScenario needs a scenario list array as input';
        alert('Scenario : '+liste[0].name);
        return liste[0].name;
    }

    loadScenario(scenarioName) {
        if(!scenarioName) throw 'ERROR : loadScenario needs a scenario name to work';
        const jsonhttp = new XMLHttpRequest();
        jsonhttp.onload = this.initScenario;
        const url = "/scenario_"+scenarioName+".json";
        jsonhttp.open("GET", url);
        jsonhttp.send();
    }

    initScenario() {
        if((this.status >= 200 || this.status < 300) && (this.responseText != null)) 
        {
            let jsonInit=this.responseText;
            QOG.prototype.units=[];
            if(jsonInit.units) for (let ScenarUnit=0; ScenarUnit<jsonInit.units.length; ScenarUnit++){ 
                QOG.prototype.units[jsonInit.units[ScenarUnit].name]= new unit(jsonInit.units[ScenarUnit].images,
                    jsonInit.units[ScenarUnit].name,
                    jsonInit.units[ScenarUnit].description);    
            };
            if(jsonInit.zones) for (let ScenarZone in jsonInit.zones){ 
                //init Zones;  
                console.log(jsonInit.zones[ScenarZone]);  
            };
        }

        
        
    }
}