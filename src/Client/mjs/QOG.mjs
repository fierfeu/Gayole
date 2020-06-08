import eventStorageInterface from './eventStorageInterface.mjs';
//import eventManager from './eventManager.mjs';
import unit from './unit.mjs';
import zone from './zone.mjs';
import scenario from './scenario.mjs';

var jsonhttp,boardRequest;

export default class QOG {
    constructor () {
        throw ('ERROR QOG is not instanciable');
    }

    create (user) {
        this.myEventStorageInterface = new eventStorageInterface(window,'localStorage');
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
        
    }

    initZones () {
        QOG.prototype.zones=[];
        const map= document.getElementsByName('gameBoardMap');
        const gameZones = map[0].areas;
        for(let area=0; area< gameZones.length;area++) {
            QOG.prototype.zones[gameZones[area].id]= new zone (gameZones[area],gameZones[area].id)
        };
        
        for (let areaZone in QOG.prototype.zones ) {
            QOG.prototype.zones[areaZone].Element.ondragover = QOG.prototype.dragOverHandler;
            QOG.prototype.zones[areaZone].Element.ondrop = QOG.prototype.dropHandler;
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
            image.className = "unit";
            image.src=currentUnit.images['recto'];
            image.name = currentUnit.name;
            let top = originTop + 457 + 10;
            image.style.top = top.toString()+'px';
            let left = originLeft + 685 + 7;
            image.style.left= left.toString()+'px';
            image.draggable = "true";
            image.ondragstart = QOG.prototype.dragStartHandler;
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

            const ScenariiListe =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];
            QOG.prototype.initScenario(QOG.prototype.chooseScenario(ScenariiListe));

            // for test only phase
            document.getElementById("strategicMap").onmousemove = (event) => {
            document.getElementById("dialogZone").innerHTML="left : "+event.clientX+" top : "+event.clientY};
        }
        
    }

    chooseScenario(liste) {
        if(!liste || !Array.isArray(liste)) throw 'ERROR QOG.chooseScenario needs a scenario list array as input';
        this.scenario = new scenario(liste);
        return this.scenario.select();
    }

    initScenario (jsonInit) {
            QOG.prototype.units=[];
            if(jsonInit.units) for (let ScenarUnit=0; ScenarUnit<jsonInit.units.length; ScenarUnit++){ 
                QOG.prototype.units[jsonInit.units[ScenarUnit].name]= new unit(jsonInit.units[ScenarUnit].images,
                    jsonInit.units[ScenarUnit].name,
                    jsonInit.units[ScenarUnit].description);    
            };
            if(jsonInit.zones) QOG.prototype.placeUnits(jsonInit.zones);
    }

     dragStartHandler(event) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("img",event.target);
        event.dataTransfer.setData("UnitName", event.target.name);
        event.dataTransfer.setData("NbUnits",1);// pour le moment depent si c'et un unit, un detachment ou une patrouille
        let fromZone;
        for (let [ZoneName,Zone] of Object.entries(QOG.prototype.zones)) {
            const unit2move = QOG.prototype.units[event.target.name];
            if (Zone.isInZone(unit2move)) { 
                fromZone = ZoneName;
                break;
            };
        };
        event.dataTransfer.setData("fromZone",fromZone);  
        event.target.classList.add('dragged');   
     }   

     dragOverHandler(event) {
        event.preventDefault();
        const fromZone = QOG.prototype.zones[event.dataTransfer.getData('fromZone')];
        if (fromZone.moveAllowedTo(QOG.prototype.zones[event.target.id]))
            event.dataTransfer.dropEffect="move";
        else event.dataTransfer.dropEffect="none";
     }

     dropHandler(event) {
        
        event.preventDefault();
        const Zone = QOG.prototype.zones[event.target.id];
        const fromZone = QOG.prototype.zones[event.dataTransfer.getData('fromZone')];
        const unit2move = QOG.prototype.units[event.dataTransfer.getData('UnitName')];
        if (fromZone.moveTo(Zone,unit2move)) {
            const img2move = document.getElementsByName(unit2move.name)[0];
            img2move.style.left = Number(Zone.Element.coords.split(',')[0])+9+"px";
            img2move.style.top = Number (Zone.Element.coords.split(',')[1])+63+"px";
        }
        

     }
        

}