import eventStorageInterface from './eventStorageInterface.mjs';
import eventManager from './eventManager.mjs';
import unit from './unit.mjs';
import zone from './zone.mjs';

var jsonhttp,boardRequest;

export default class QOG {
    constructor (storage) {
        if(!storage) throw 'ERROR need at least a storage interface to instanciate a QOG Game';
        this.storage=storage;
        console.log(this.storage);
        //this.window = window;
    }

    create (user) {
        this.storage.setItem('gameLaunched','QOG');
        if(user) {
            this.storage.setItem('user','user');
        }
        this.myEventStorageInterface = new eventStorageInterface(this.window,'localStorage');

        if (!this.window.XMLHttpRequest) throw "ERROR you can't play Gayole with your current browser : sorry";
        boardRequest = new this.window.XMLHttpRequest();
        boardRequest.onload = this.initBoardGame;
        const url = "/QOG_boardGame.html";
        boardRequest.open("GET", url);
        boardRequest.send();
        this.loadScenario(this.chooseScenario(), new this.window.XMLHttpRequest());
        
    }

    initBoardGame () {
        if((boardRequest.status >= 200 || boardRequest.status < 300) && (boardRequest.responseText != null)) 
        {
            // the following code is for explanatory stuff only
            document.getElementById('strategicMap').onmousemove = (event) =>{
                document.getElementById('dialogZone').innerHTML
            };
            document.getElementById('GameBoard').innerHTML = boardRequest.responseText;
            document.getElementById('GameBoard').style.display="inline";
            
            this.zones=[];
        }
    }

    chooseScenario(liste) {
        if(!liste || !Array.isArray(liste)) throw 'ERROR QOG.chooseScenario needs a scenario list array as input';
        alert('Scenario : '+liste[0].name);
        return liste[0].name;
    }

    loadScenario(scenarioName,xhr) {
        if(!scenarioName || !xhr) throw 'ERROR : loadScenario needs a scenario name and a xhr object to work';
        //jsonhttp = new this.window.XMLHttpRequest();
        jsonhttp=xhr;
        jsonhttp.onload = this.initScenario;
        const url = "/scenario_"+scenarioName+".json";
        jsonhttp.open("GET", url);
        jsonhttp.send();
    }

    initScenario() {
        if((jsonhttp.status >= 200 || jsonhttp.status < 300) && (jsonhttp.responseText != null)) 
        {
            let jsonInit;
            try {jsonInit = JSON.parse(jsonhttp.responseText)}
            catch (e) { throw e;}
            this.units=[];
            if(jsonInit.units) for (let ScenarUnit in jsonInit.units ){ 
                this.units[jsonInit.units[ScenarUnit].name]= new unit(jsonInit.units[ScenarUnit].images,
                    jsonInit.units[ScenarUnit].name,
                    jsonInit.units[ScenarUnit].description);    
            };
            if(this.zones && jsonInit.zones) for (let ScenarZone in jsonInit.zones){ 
                //init Zones;  
                console.log(jsonInit.zones[ScenarZone]);  
            };
        }

        
        
    }
}