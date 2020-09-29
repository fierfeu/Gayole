import unit from './unit.mjs';
import {unitSet} from './unitSet.mjs';
import zone from './zone.mjs';

export default class QOG {
    constructor () {
        throw ('ERROR QOG is not instanciable');
    }

    boards () {
        this.loadExternalRessources({'url':'/QOG_boardGame.html'}).then((data)=>{
            document.getElementById('gameBoard').innerHTML = data;
            document.getElementById('gameBoard').style.display="block";
            QOG.prototype.initZones(this);
        }).catch((err)=>{
            throw err;
        });
    }

    setUp() {
        const scenarioURL="/scenario_default.json";
        this.loadExternalRessources({'url':scenarioURL}).then ((data)=>{
            QOG.prototype.scenarioParser(JSON.parse(data),this);
            QOG.prototype.initScenario.call(this,this.currentScenario);
            let turn = document.getElementById('turn').getElementsByTagName('span')[0];
            turn.innerHTML = this.currentScenario.conditions.turnNb;
            this.currentGame.turnLeft = this.currentScenario.conditions.turnNb;
            QOG.prototype.initGameEvent();
        }).catch((err)=>{console.log(err)});
    }

    didacticiel () {
        if(!this.currentScenario) throw 'ERROR no Scenario declared';
        if(this.currentScenario.didacticiel.used) {
            this.didacticiel= new Didacticiel(this.currentScenario.didacticiel.file);
        }

    }

    run() {
        if(!this.units instanceof Object) throw 'ERROR no units to let game running'
        if(!this.zones instanceof Object) throw 'ERROR no zones to let game running'
        if(!this.hasOwnProperty('currentScenario')) throw 'ERROR no scenario to let game running';
        window.localStorage.setItem('gameLaunched',this.currentGame.name);
        this.currentGame.turnLeft --;
    }

    getGameName () {
        return 'QOG';
    }

    initZones (gameManager) {
        QOG.prototype.zones={};
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
        if (gameManager) gameManager.zones = QOG.prototype.zones;
    }

    initGameEvent () {
        if(!document.getElementById('turn')) throw ('gameboard html not loaded');
        const helpedData = document.querySelectorAll('[data-help]');
        for (let i=0;i<helpedData.length;i++ ){
            helpedData[i].addEventListener('mouseover',QOG.prototype.showHelp,true);
            helpedData[i].addEventListener('mouseout',QOG.prototype.hideHelp,true);
        }
    }

    showHelp(ev) {
        if(!ev) throw 'no event object provided';
        let helpWin = document.getElementById('dialogWindow');
        if(helpWin.classList.contains('gameBoardHide')) {
            helpWin.innerHTML=ev.currentTarget.dataset.help;
            if(ev.currentTarget.style.position != 'absolute'){
                helpWin.style.left='950px';
                helpWin.style.top='90px';
            } else {
                helpWin.style.left = parseInt(ev.currentTarget.style.left)+60+'px';
                helpWin.style.top = parseInt(ev.currentTarget.style.top)+60+'px';
            }
            
            helpWin.classList.remove('gameBoardHide');
        };
    }

    hideHelp(ev) {
        let helpWin = document.getElementById('dialogWindow');
        helpWin.classList.add('gameBoardHide');
        helpWin.innerHTML='';
    }

    placeAPiece (unit4piece,where2place,) {
        if(!unit4piece || !(unit4piece instanceof unit||unit4piece instanceof unitSet)) throw ("ERROR - QOG.placeAPiece : no unit declared");
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
        piece.style.position ='absolute';
        piece.style.left = (parseInt(coords[0])+5)+'px';
        piece.style.top = (parseInt(coords[1])+5)+'px';
        piece.dataset.help = unit4piece.getDescription();
        document.getElementById('strategicMap').append(piece);
    }

    randomizeUnit(zone,description,manager) {
        if(!description) throw "ERROR no json description to randomize unit for zones";
        const range = description.length -2;
        const rand = Math.round(Math.random()*range)+1;
        zone.attach(manager.units[description[rand].name]);
        QOG.prototype.placeAPiece(manager.units[description[rand].name],zone);
    };

    placeUnits (jsonDesc, IADrived,manager) {
        if(!jsonDesc) throw 'ERROR needs of a json description';
        if((jsonDesc instanceof String)||(typeof jsonDesc === 'string')) throw "ERROR : PlaceUnits => description can't be a string";
        if (!manager && (typeof manager != 'object')) throw 'ERROR placeUnits needs an objetc to store units';
        for (let type in jsonDesc) {
                switch (type) {
                    case "town":
                        if(jsonDesc.town[0]==='random') {
                            for(const zoneName in manager.zones) {
                               if (manager.zones[zoneName].ground === 'town') {
                                QOG.prototype.randomizeUnit(manager.zones[zoneName],jsonDesc.town,manager);
                                if (IADrived)
                                    manager.zones[zoneName].Element.ondragover = "";
                                }
                            }
                        }
                        break;
                    case "zones" :
                        for (let key in jsonDesc.zones) {
                            manager.zones[key].attach(manager.units[jsonDesc.zones[key]]);
                            if (IADrived)
                                manager.zones[key].Element.ondragover = "";
                            QOG.prototype.placeAPiece(manager.units[jsonDesc.zones[key]],manager.zones[key]);
                        }
                        break;
                    default : throw 'ERROR bad localisation in scenario json';
                }
            };

    }

    
    initScenario (currentScenario) {
            this.units ={};
            if(!currentScenario.opponent) throw ('ERROR parsing false');
            const NbOpponents = currentScenario.opponent[0];
            for (let i=1;i<=NbOpponents;i++) {
                for (let j=0;j< parserOpponentDef.length;j++) {
                    switch(parserOpponentDef[j]) {
                        case 'localisations' :
                            QOG.prototype.placeUnits(currentScenario.opponent[i][1][parserOpponentDef[j]]
                                ,true,this);
                            break;
                        case 'units' : 
                            if(currentScenario.opponent[i][1][parserOpponentDef[j]].Nb !== 0) {
                                let Nb = currentScenario.opponent[i][1][parserOpponentDef[j]].Nb;
                                let unitsArray = currentScenario.opponent[i][1][parserOpponentDef[j]].unitsDesc;
                                for (let u=0; u< Nb; u++) {
                                    this.units[unitsArray[u].name] = new unit(unitsArray[u].images,
                                        unitsArray[u].name,
                                        unitsArray[u].description,
                                        unitsArray[u].values);
                                }
                            
                            }
                            break;
                        case 'patrols':
                            if(currentScenario.opponent[i][1][parserOpponentDef[j]].Nb !== 0) {
                                let NbOfPatrols = currentScenario.opponent[i][1][parserOpponentDef[j]].Nb;
                                let patrols = currentScenario.opponent[i][1][parserOpponentDef[j]].unitsDesc;
                                for (let p=0;p<NbOfPatrols;p++) {
                                    patrols[p].units=[];
                                    patrols[p].patrolComposition.forEach((id)=>{
                                        patrols[p].units.push(this.units[id]);
                                    })
                                    this.units[patrols[p].name] = new unitSet (
                                        patrols[p].images,
                                        patrols[p].name,
                                        patrols[p].description,
                                        patrols[p].units,
                                        patrols[p].values
                                    );
                                }
                            }
                            break;
                    }

                }
            }
    }

     dragStartHandler(event) {
        event.target.removeEventListener('mouseover',QOG.prototype.showHelp,true);
        event.target.removeEventListener('mouseout',QOG.prototype.hideHelp,true);
        document.getElementById('dialogWindow').classList.add('gameBoardHide');
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("img",event.target);
        event.dataTransfer.setData("UnitName", event.target.name);
        event.dataTransfer.setData("NbUnits",1);// pour le moment depent si c'et un unit, un detachment ou une patrouille
        let fromZone;
        for (let [ZoneName,Zone] of Object.entries(gameManager.zones)) {
            const unit2move = gameManager.units[event.target.name];
            if (Zone.isInZone(unit2move)) { 
                fromZone = ZoneName;
                break;
            };
        };
        event.dataTransfer.setData("fromZone",fromZone);  
        event.target.classList.add('dragged');   
     }   

     dragEndHandler (event) {
        event.preventDefault();
        event.target.classList.remove('dragged');
        event.target.addEventListener('mouseover',QOG.prototype.showHelp,true);
        event.target.addEventListener('mouseout',QOG.prototype.hideHelp,true);
     }

     dragoverHandler (event) {
        event.preventDefault();
     }

     dropHandler(event) {
        event.preventDefault();
        
        const Zone = gameManager.zones[event.target.id];
        const fromZone = gameManager.zones[event.dataTransfer.getData('fromZone')];
        const unit2move = gameManager.units[event.dataTransfer.getData('UnitName')];
        if (fromZone.moveTo(Zone,unit2move)) {
            const img2move = document.getElementsByName(unit2move.name)[0];
            img2move.style.left = Number(Zone.Element.coords.split(',')[0])+5+"px";
            img2move.style.top = Number (Zone.Element.coords.split(',')[1])+5+"px";
        }
        

     }
        

}

import {Parser, parserOpponentDef} from './QOG_Parser.mjs';
import Didacticiel from './Didacticiel.mjs';
QOG.prototype.scenarioParser = Parser;