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

    initZones () {
        QOG.prototype.zones=[];
        const map= document.getElementsByName('gameBoardMap');
        const gameZones = map[0].areas;
        for(let area=0; area< gameZones.length;area++) {
            QOG.prototype.zones[gameZones[area].id]= new zone (gameZones[area],gameZones[area].id)
        };
        
        for (let areaZone in QOG.prototype.zones ) {
            if(QOG.prototype.zones[areaZone].Element.dataset.links) {
                let sourceZone=QOG.prototype.zones[areaZone].Element;
                sourceZone=sourceZone.dataset.links.split(',');
                for (let i=0;i<sourceZone.length;i++) {
                    const name = sourceZone[i].split(':')[0];
                    const cost = sourceZone[i].split(':')[1];
                    QOG.prototype.zones[areaZone].linkTo(QOG.prototype.zones[name],cost);
                };
            };
        };

    }

    placeUnits (jsonDesc) {
        if(!jsonDesc) throw 'ERROR needs of a json description';
        if((jsonDesc instanceof String)||(typeof jsonDesc === 'string')) throw "ERROR : PlaceUnits => description can't be a string";
        let boardDiv = document.getElementById('strategicMap');
        for (let key in jsonDesc) {
            if (!QOG.prototype.zones[key]) throw 'ERROR bad zone in json';
            QOG.prototype.zones[key].attach(QOG.prototype.units[jsonDesc[key]]);
            let currentUnit = QOG.prototype.units[jsonDesc[key]];
            let originLeft=document.getElementById('strategicMap').offsetLeft;
            let originTop=document.getElementById('strategicMap').offsetTop;
            let image = document.createElement('img');
            image.src=currentUnit.images['recto'];
            image.style.position="absolute";
            let top = originTop + 457 + 10;
            image.style.top = top.toString()+'px';
            let left = originLeft + 685 + 7;
            image.style.left= left.toString()+'px';
            image.style.width="30px";
            image.style.boxShadow ="2px 2px #baa0396b";
            image.draggable = true;
            boardDiv.appendChild(image);
        };

    }

    initBoardGame () {
        if((this.status >= 200 || this.status < 300) && (this.responseText != null)) 
        {
            // the following code is for explanatory stuff only
            document.getElementById('strategicMap').onmousemove = (event) =>{
                document.getElementById('dialogZone').innerHTML= "<p>top : "+event.offsetX+ "left :"+event.offsetY+"</p>";
            };
            document.getElementById('GameBoard').innerHTML = this.responseText;
            document.getElementById('GameBoard').style.display="inline";

            QOG.prototype.initZones();
        }
    }

    chooseScenario(liste) {
        if(!liste || !Array.isArray(liste)) throw 'ERROR QOG.chooseScenario needs a scenario list array as input';
        alert('Scenario par défaut : '+liste[0].name);
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
            let jsonInit=JSON.parse(this.responseText);
            QOG.prototype.units=[];
            if(jsonInit.units) for (let ScenarUnit=0; ScenarUnit<jsonInit.units.length; ScenarUnit++){ 
                QOG.prototype.units[jsonInit.units[ScenarUnit].name]= new unit(jsonInit.units[ScenarUnit].images,
                    jsonInit.units[ScenarUnit].name,
                    jsonInit.units[ScenarUnit].description);    
            };
            if(jsonInit.zones) QOG.prototype.placeUnits(jsonInit.zones); 
        }

        
        
    }
}