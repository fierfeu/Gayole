import eventStorageInterface from './eventStorageInterface.mjs';
//import eventManager from './eventManager.mjs';
import unit from './unit.mjs';
import zone from './zone.mjs';
import scenario from './scenario.mjs';
import Game from './game.mjs';

const parserDef =[["name"],["LRDG","Axis"],["roundNb","returnZone"]];
const OPPONENT = 1;
const VICOND =2;
const parserOpponentDef = ["units","detachments","patrols","localisations"];
var jsonhttp,boardRequest;

export default class QOG {
    constructor () {
        throw ('ERROR QOG is not instanciable');
    }

    boards () {
        console.log('QOG.prototype.boards was called');
        gameManager.loadExternalRessources({'url':'/QOG_boardGame.html'}).then((data)=>{
            document.getElementById('gameBoard').innerHTML = data;
            document.getElementById('gameBoard').style.display="block";
            QOG.prototype.initZones();
        })
    }

    setUp() {
        console.log('QOG.prototype.setUp was called');
        QOG.prototype.units=[];
        const ScenariiListe =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];
        QOG.prototype.chooseScenario(ScenariiListe);
    }

    create (user) {
        //this.myEventStorageInterface = new eventStorageInterface(window,'localStorage');
        window.localStorage.setItem('gameLaunched','QOG');
        /*if(user) {
            window.localStorage.setItem('user','user');
        }
        if (!XMLHttpRequest) throw "ERROR you can't play Gayole with your current browser : sorry";
        const boardRequest = new XMLHttpRequest();
        boardRequest.onload = this.initBoardGame;
        const url = "/QOG_boardGame.html";
        boardRequest.open("GET", url);
        boardRequest.send();*/
        new Game();
        gameManager.create(QOG);
        //QOG.prototype.units=[];
    }

    initZones () {
        QOG.prototype.zones=[];
        const map= document.getElementsByName('gameBoardMap');
        const gameZones = map[0].areas;
        for(let area=0; area< gameZones.length;area++) {
            QOG.prototype.zones[gameZones[area].id]= new zone (gameZones[area],gameZones[area].id)
        };
        
        for (let areaZone in QOG.prototype.zones ) {
            QOG.prototype.zones[areaZone].Element.ondragover=QOG.prototype.dragoverHandler;
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
            if(QOG.prototype.zones[areaZone].Element.dataset.hasOwnProperty('ground'))
            QOG.prototype.zones[areaZone].ground = QOG.prototype.zones[areaZone].Element.dataset.ground;
        };

    }

    placeAPiece (unit4piece,where2place) {
        if(!unit4piece || !(unit4piece instanceof unit)) throw ("ERROR - QOG.placeAPiece : no unit declared");
        if(!where2place || !(where2place instanceof zone)) throw("ERROR - QOG.PlaceAPiece : No zone declared");

        let piece = document.createElement('img');
        piece.className = "unit";
        piece.src=unit4piece.images['recto'];
        piece.name = unit4piece.name;

        piece.draggable=false;
        if (unit4piece.draggable) {
            piece.draggable = "true";
            piece.ondragstart = QOG.prototype.dragStartHandler;
            piece.ondragend = QOG.prototype.dragEndHandler;
        }

        piece.id=unit4piece.name.replace(/\s+/g, '') + Date.now();

        let coords = where2place.Element.coords.split(',');
        piece.style.left = (parseInt(coords[0])+5)+'px';
        piece.style.top = (parseInt(coords[1])+5)+'px';

        document.getElementById('strategicMap').append(piece);
    }

    randomizeUnit(zone,description) {
        if(!description) throw "ERROR no json description to randomize unit for zones";
        const range = description.length -2;
        const rand = Math.round(Math.random()*range)+1;
        zone.attach(QOG.prototype.units[description[rand].name]);
        QOG.prototype.placeAPiece(QOG.prototype.units[description[rand].name],zone);
    };

    placeUnits (jsonDesc, IADrived) {
        if(!jsonDesc) throw 'ERROR needs of a json description';
        if((jsonDesc instanceof String)||(typeof jsonDesc === 'string')) throw "ERROR : PlaceUnits => description can't be a string";
        
        for (let type in jsonDesc) {
                switch (type) {
                    case "town":
                        if(jsonDesc.town[0]==='random') {
                            for(const zoneName in QOG.prototype.zones) {
                               if (QOG.prototype.zones[zoneName].ground === 'town') 
                                QOG.prototype.randomizeUnit(QOG.prototype.zones[zoneName],jsonDesc.town);
                                if (IADrived)
                                    QOG.prototype.zones[zoneName].Element.ondragover = "";
                            }
                        }
                        break;
                    case "zones" :
                        for (let key in jsonDesc.zones) {
                            QOG.prototype.zones[key].attach(QOG.prototype.units[jsonDesc.zones[key]]);
                            if (IADrived)
                                QOG.prototype.zones[key].Element.ondragover = "";
                            QOG.prototype.placeAPiece(QOG.prototype.units[jsonDesc.zones[key]],QOG.prototype.zones[key]);
                        }
                        break;
                    default : throw 'ERROR bad localisation in scenario json';
                }
            };

    }

    initBoardGame () {
        if((this.status >= 200 && this.status < 300) && (this.responseText != null)) 
        {
            // the following code is for explanatory stuff only
            document.getElementById('strategicMap').onmousemove = (event) =>{
                document.getElementById('dialogZone').innerHTML= "<p>top : "+event.offsetX+ "left :"+event.offsetY+"</p>";
            };
            // end of explo

            document.getElementById('gameBoard').innerHTML = this.responseText;
            document.getElementById('gameBoard').style.display="block";

            QOG.prototype.initZones();

            const ScenariiListe =[["Default Scenario","This is the first scenario to learn how to play","/scenario_default.json"]];
            QOG.prototype.chooseScenario(ScenariiListe);
            
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
                                unitsArray[u].description,
                                unitsArray[u].values);
                        }

                    } 
                    if (parserOpponentDef[j] === 'localisations'){
                        QOG.prototype.placeUnits(currentScenario.opponent[i][1][parserOpponentDef[j]],true);
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

     dragEndHandler (event) {
        event.target.classList.remove('dragged');
     }

     dragoverHandler (event) {
        event.preventDefault();
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