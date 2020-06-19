import eventStorageInterface from './eventStorageInterface.mjs';
//import eventManager from './eventManager.mjs';
import unit from './unit.mjs';
import zone from './zone.mjs';
import scenario from './scenario.mjs';

const parserDef =[["name"],["LRDG","Axis"],["roundNb","returnZone"]];
const OPPONENT = 1;
const VICOND =2;
const parserOpponentDef = ["units","detachments","patrols","localisations"];
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
        QOG.prototype.units=[];
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
                sourceZone=sourceZone.dataset.links.split(';');
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
            let zoneCoords = QOG.prototype.zones[key].Element.coords;
            zoneCoords = zoneCoords.split(',');
            let left =Number(zoneCoords[0])+5;
            let top = Number(zoneCoords[1])+5;
            image.style.top = top.toString()+'px';
            image.style.left= left.toString()+'px';
            image.draggable = "true";
            image.ondragstart = QOG.prototype.dragStartHandler;
            boardDiv.appendChild(image);
        };

    }

    initBoardGame () {
        if((this.status >= 200 && this.status < 300) && (this.responseText != null)) 
        {
            // the following code is for explanatory stuff only
            document.getElementById('strategicMap').onmousemove = (event) =>{
                document.getElementById('dialogZone').innerHTML= "<p>top : "+event.offsetX+ "left :"+event.offsetY+"</p>";
            };
            document.getElementById('gameBoard').innerHTML = this.responseText;
            document.getElementById('gameBoard').style.display="block";

            QOG.prototype.initZones();

            const ScenariiListe =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];
            QOG.prototype.chooseScenario(ScenariiListe);
            

            // for test only phase
            document.getElementById("strategicMap").onmousemove = (event) => {
            document.getElementById("dialogZone").innerHTML="left : "+event.clientX+" top : "+event.clientY};
        }
        
    }

    chooseScenario(liste) {
        if(!liste || !Array.isArray(liste)) throw 'ERROR QOG.chooseScenario needs a scenario list array as input';
        window.currentScenario = new scenario(liste,false,QOG.prototype.initScenario);
        window.currentScenario.select();
        
    }

    scenarioParser (data) {
        if(!data) throw ('ERROR no scenario data to parse : no scenario initiated');
        if(!(typeof(data)==='object')) throw ('ERROR badly formated scenario data to parse: no scenario initiated');
        
        if(!data.hasOwnProperty('description')) throw ('ERROR badly formated object : keys are missing: no scenario description Object');
        if(!data.hasOwnProperty('conditions')) throw ('ERROR badly formated object : keys are missing: no vitory conditions defined');
        currentScenario.opponent=[];
        currentScenario.opponent[0]=2;
        currentScenario.opponent[1] = parserDef[OPPONENT][0];
        currentScenario.opponent[2] = parserDef[OPPONENT][1];
        if(!data.hasOwnProperty(currentScenario.opponent[1])) throw ('ERROR badly formated object : keys are missing: no opponent name for side: '+currentScenario.opponent[1]);
        if(!data.hasOwnProperty(currentScenario.opponent[2])) throw ('ERROR badly formated object : keys are missing: no opponent name for side: '+currentScenario.opponent[2]);
        
        if(!data.description.hasOwnProperty('name')) throw ('ERROR badly formated object : keys are missing: no scenario name in description');
        currentScenario.description = data.description;
        for (let i=0;i<parserDef[VICOND].length;i++) {
            if(!data.conditions.hasOwnProperty(parserDef[VICOND][i])) throw ('ERROR badly formated object : keys are missing: no '+ parserDef[VICOND][i]+' in victory conditions');
        }
        currentScenario.conditions = data.conditions;

        for (let i=1;i<=currentScenario.opponent[0];i++) {
            currentScenario.opponent[i]=[parserDef[OPPONENT][i-1],data[parserDef[OPPONENT][i-1]]];
            for (let j=0; j< parserOpponentDef.length;j++) {
                if(!currentScenario.opponent[i][1].hasOwnProperty(parserOpponentDef[j])) 
                    throw ('ERROR badly formated object : keys are missing: no '+parserOpponentDef[j]+' definition for opponent: '+currentScenario.opponent[i][0]);
            }
        };
    }

    initScenario (data) {
            
            QOG.prototype.scenarioParser(data);
            if(!currentScenario.opponent) throw ('ERROR parsing false');
            for (let i=1;i<=currentScenario.opponent[0];i++) {
                for (let j=0;j< parserOpponentDef.length;j++) {
                    if(parserOpponentDef[j]!== 'localisations' && currentScenario.opponent[i][1][parserOpponentDef[j]].Nb !== 0) {
                        let Nb = currentScenario.opponent[i][1][parserOpponentDef[j]].Nb;
                        let unitsArray = currentScenario.opponent[i][1][parserOpponentDef[j]].unitsDesc;
                        for (let u=0; u< Nb; u++) {
                            QOG.prototype.units[unitsArray[u].name] = new unit(unitsArray[u].images,
                                unitsArray[u].name,
                                unitsArray[u].description);
                        }

                    } 
                    if (parserOpponentDef[j] === 'localisations'){
                        if (currentScenario.opponent[i][1][parserOpponentDef[j]].zones) {
                            let localisations = currentScenario.opponent[i][1][parserOpponentDef[j]].zones;
                            QOG.prototype.placeUnits(localisations);
                        }
                    }

                }
            }
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
        /*const fromZone = QOG.prototype.zones[event.dataTransfer.getData('fromZone')];
        if (fromZone.moveAllowedTo(QOG.prototype.zones[event.target.id]))
            event.dataTransfer.dropEffect="move";
        else event.dataTransfer.dropEffect="none";*/
     }

     dropHandler(event) {
        
        event.preventDefault();
        const Zone = QOG.prototype.zones[event.target.id];
        const fromZone = QOG.prototype.zones[event.dataTransfer.getData('fromZone')];
        const unit2move = QOG.prototype.units[event.dataTransfer.getData('UnitName')];
        if (fromZone.moveTo(Zone,unit2move)) {
            const img2move = document.getElementsByName(unit2move.name)[0];
            img2move.style.left = Number(Zone.Element.coords.split(',')[0])+5+"px";
            img2move.style.top = Number (Zone.Element.coords.split(',')[1])+5+"px";
        }
        

     }
        

}