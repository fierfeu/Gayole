import unit from './unit.mjs';
import {unitSet} from './unitSet.mjs';
import zone from './zone.mjs';

// constants and game tables for "Who dares win"
/** 
 * @constant {String} NO_MVT
 * @description value when movement is not allowed to a given zone
 */
const NO_MVT='No';
/** 
 * @constant {Object} DISCRETION_TEST
 * @description table to define dice(d6) number and MD to roll discretion test
 * @example dices = DISCRETION_TEST["Oasis"]["dice"]
 */
const DISCRETION_TEST = {
    "Desert_rocky":{"dice":1,"MD":-1},
    "Desert_sand":{"dice":1,"MD":0},
    "Oasis":{"dice":2,"MD":0},
    "Village":{"dice":2,"MD":0},
    "Town":{"dice":3,"MD":0},
    "Fort":{"dice":3,"MD":0},
    "Airport":{"dice":3,"MD":0}
};
/** 
 * @constant {Array} DISCRETION_MD
 * @description Modifier to be applied according to the nb of unit moved
 * @example md = DISCRETION_MD[unitSet.nbOfUnitInPatril()] 
 */
const DISCRETION_MD = [
    1,0,0,0,1,1,1,2,2,3
];
/** 
 * @constant {Number} MD_AXIS_UNIT
 * @description Modifier to apply for each Axis unit in the targeted zone
 */
const MD_AXIS_UNIT = DISCRETION_MD[0];
// End of constant and tables declaration

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
            window.localStorage.setItem('gameLaunched',this.currentGame.name);
            QOG.prototype.initGameEvent();
            //QOG.prototype.run.call(this); // for #37 bug
            const Run = new CustomEvent('GameRunning',{});
            window.dispatchEvent(Run)
        }).catch((err)=>{console.log(err)});
    }

    didacticiel () {
        if(!this.currentScenario) throw 'ERROR no Scenario declared';
        if(this.currentScenario.didacticiel.used) {
            this.didacticiel= new Didacticiel(this.currentScenario.didacticiel.file);
        }

    }

    run() {
        if(!(this.units instanceof Object)) throw 'ERROR no units to let game running'
        if(!(this.zones instanceof Object)) throw 'ERROR no zones to let game running'
        if(!(this.hasOwnProperty('currentScenario'))) throw 'ERROR no scenario to let game running';
        this.currentGame.turnLeft --;
        this.currentGame.patrolNb=0;
        for (let id in this.units) {
            if (this.units[id] instanceof unitSet) {
                this.currentGame.patrolNb ++;
                const nbOfUnitInPatrol = this.units[id].getNbOfUnitsInPatrol();
                if (nbOfUnitInPatrol>=1 && nbOfUnitInPatrol<3) {
                    this.units[id].actionPoints = 3+ Math.round(Math.random()*5);
                }
                else if (nbOfUnitInPatrol>=4 && nbOfUnitInPatrol<8) {
                    this.units[id].actionPoints = 4+ Math.round(Math.random()*5) +Math.round(Math.random()*5);
                }
                else {
                    this.units[id].actionPoints = 5+ Math.round(Math.random()*5)+Math.round(Math.random()*5)+Math.round(Math.random()*5);
                }
                const el =document.getElementById('PA').getElementsByTagName('span')[0];

                el.innerHTML=this.units[id].actionPoints;

            }
        }


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
            QOG.prototype.zones[areaZone].Element.ondragenter=QOG.prototype.dragEnterHandler;
            QOG.prototype.zones[areaZone].Element.ondragleave=QOG.prototype.dragLeaveHandler;
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
            piece.ondrag = QOG.prototype.dragHandler;
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
                               if (manager.zones[zoneName].ground === 'Town') {
                                    QOG.prototype.randomizeUnit(manager.zones[zoneName],jsonDesc.town,manager);
                                    if (IADrived) {
                                        manager.zones[zoneName].Element.ondrop = "";
                                        manager.zones[zoneName].Element.ondragenter = "";
                                        manager.zones[zoneName].Element.ondragleave = "";
                                        manager.zones[zoneName].Element.ondragover = "";
                                    }
                                    
                                }
                            }
                        }
                        break;
                    case "zones" :
                        for (let key in jsonDesc.zones) {
                            manager.zones[key].attach(manager.units[jsonDesc.zones[key]]);
                            if (IADrived) {
                                manager.zones[key].Element.ondrop = "";
                                manager.zones[key].Element.ondragenter = "";
                                manager.zones[key].Element.ondragleave = "";
                                manager.zones[key].Element.ondragover = "";
                            }
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
        
        gameManager.unit2Move = gameManager.units[event.target.name];

        let fromZone;
        for (let [ZoneName,Zone] of Object.entries(gameManager.zones)) {
            const unit2move = gameManager.units[event.target.name];
            if (Zone.isInZone(unit2move)) { 
                fromZone = ZoneName;
                break;
            };
        };
 
        gameManager.fromZone = gameManager.zones[fromZone];

        event.target.classList.add('dragged');   
        event.dataTransfer.effectAllowed = "move";
     }   

     dragHandler (e) {
        e.preventDefault()
     }

     dragEndHandler (event) {
        //event.preventDefault();
        event.target.classList.remove('dragged');
        event.target.addEventListener('mouseover',QOG.prototype.showHelp,true);
        event.target.addEventListener('mouseout',QOG.prototype.hideHelp,true);
     }

     dragoverHandler (event) {
        event.preventDefault();
        const cost = parseInt(document.getElementById('MVTcost').innerText);
        if (!Number.isNaN(cost)) {
            event.dataTransfer.dropEffect = "move";
        } else {
            event.dataTransfer.dropEffect='none';
        }

     }

     dropHandler(event) {
        const costDiv = document.getElementById('MVTcost');
        let nbOfUnits
        if (costDiv.innerText !== NO_MVT) {
            const cost = parseInt(costDiv.innerText);
            costDiv.classList.add('gameBoardHide');

            const zone = gameManager.zones[event.target.id];

            if (gameManager.fromZone.moveTo(zone,gameManager.unit2Move)) {
                const img2move = document.getElementsByName(gameManager.unit2Move.name)[0];
                img2move.style.left = Number(zone.Element.coords.split(',')[0])+5+"px";
                img2move.style.top = Number (zone.Element.coords.split(',')[1])+5+"px";
                const PA = document.getElementById('PA').getElementsByTagName('span')[0];
                const remain = parseInt(PA.innerText)+cost;
                PA.innerText = ''+(parseInt(PA.innerText)+cost);
                if (typeof gameManager.unit2Move.getNbOfUnitsInPatrol !=='undefined') nbOfUnits = gameManager.unit2Move.getNbOfUnitsInPatrol();
                else nbOfUnits = 1;
                const discretionEvent = new window.CustomEvent('discretiontest',{detail:{NbOfUnits:nbOfUnits}});
                zone.Element.addEventListener('discretiontest',QOG.prototype.performDiscretionTest)
                zone.Element.dispatchEvent(discretionEvent);
            }
            gameManager.unit2Move = undefined;
            gameManager.fromZone = undefined;
        } 
        
     }
    
     /**
      * @description ondragenter handler
      * @author fierfeu
      * @param {DragEvent} event
      * @memberof QOG
      */
     dragEnterHandler (event) {   
        const zone = gameManager.zones[event.target.id];
        let nbOfUnits=0;
        // calculate cost
        if (typeof gameManager.unit2Move.getNbOfUnitsInPatrol !=='undefined') nbOfUnits = gameManager.unit2Move.getNbOfUnitsInPatrol();
        else nbOfUnits = 1;
        let cost = Math.round(nbOfUnits * gameManager.fromZone.moveAllowedTo(zone,gameManager.unit2Move));
        let zoneCoords = event.target.coords;
        zoneCoords = zoneCoords.split(',');
        const costDiv = document.getElementById('MVTcost');
        costDiv.style.left = zoneCoords[2]+'px';
        costDiv.style.top = (parseInt(zoneCoords[3])+80)+'px';
        // verify that cost is less than actionpoints or disallow movement
        const actionPoints = parseInt(document.getElementById('PA').getElementsByTagName('span')[0].innerText);
        if ((actionPoints - cost) >= 0) {
            event.dataTransfer.dropEffect = "move";
            costDiv.innerText = "-"+cost;
        } else {
            event.dataTransfer.dropEffect='none';
            costDiv.innerText = NO_MVT;
        }
        costDiv.classList.toggle('gameBoardHide');

     }

     dragLeaveHandler(event) {
        
         const costDiv = document.getElementById('MVTcost');
         costDiv.classList.add('gameBoardHide');
     }

     performDiscretionTest(ev) {
        if(!ev || !(ev instanceof window.CustomEvent)) throw('performDiscretionTest must be called throught a customeEvent firing process');
        else {
            let alarmed = false;
            let roll1, roll2, roll3;
            let MD = DISCRETION_MD[ev.detail.NbOfUnits];
            let ground= ev.target.dataset.ground;
            if(ground != undefined) {
                ground = ground.split(',');
                if (ground.length == 1) {
                    switch (ground[0]) {
                        case 'Desert_sand' :
                            if (QOG.prototype.diceRoll()+MD > 5) alarmed=true;
                            break;
                        case 'Desert_rocky' :
                            if ((QOG.prototype.diceRoll()-1)+MD > 5) alarmed=true;
                            break; 
                        case 'Village' :
                            roll1 = QOG.prototype.diceRoll()+MD;
                            roll2 = QOG.prototype.diceRoll()+MD;
                            if (roll1 > 5 || roll2 >5 ) alarmed=true;
                            break;
                        case "Town" :
                            roll1 = QOG.prototype.diceRoll()+MD;
                            roll2 = QOG.prototype.diceRoll()+MD;
                            roll3 = QOG.prototype.diceRoll()+MD;
                            if (roll1 > 5 || roll2 >5 || roll3 >5 ) alarmed=true;
                            break;
                    }
                } else {
                    switch (ground[1]) {
                        case "Oasis" :
                            roll1 = gameManager.currentGame.prototype.diceRoll()+MD;
                            roll2 = gameManager.currentGame.prototype.diceRoll()+MD;
                            if (roll1 > 5 || roll2 >5 ) alarmed=true;
                            break;
                        case "Airport" :
                            roll1 = gameManager.currentGame.prototype.diceRoll()+MD;
                            roll2 = gameManager.currentGame.prototype.diceRoll()+MD;
                            roll3 = gameManager.currentGame.prototype.diceRoll()+MD;
                            if (roll1 > 5 || roll2 >5 || roll3 >5 ) alarmed=true;
                            break;
                    }
    
                }
                if(alarmed) QOG.prototype.increaseAlarmLevel();
            }
            
        }
     }

     diceRoll () {
        let roll = 1+Math.round(Math.random()*5)
        //console.log(roll); for test only
        return roll;
     }

     increaseAlarmLevel(val=1) {
        if(gameManager.currentGame.alarmLevel == 4) return;
        let dialog = document.createElement('div');
        let map = document.getElementById('strategicMap');
        dialog.style.left="450px";
        dialog.style.top ="300px";
        dialog.style.position="absolute";
        dialog.innerText = "You've been detected by Axis : Alarm Level increase by one";
        dialog.classList.add('dialogWindow');
        dialog.onclick= (ev) =>{ 
            document.getElementById('strategicMap').removeChild(ev.target);
        }
        map.appendChild(dialog);
        let alarmeView = document.getElementById('alarm');
        if(val == -1) {
            gameManager.currentGame.alarmLevel --;
        } else {
            if(gameManager.currentGame.alarmLevel)  gameManager.currentGame.alarmLevel ++
            else gameManager.currentGame.alarmLevel=1
        }
        alarmeView.style.backgroundPositionX = (-56*gameManager.currentGame.alarmLevel)+'px';
     }

}

import {Parser, parserOpponentDef} from './QOG_Parser.mjs';
import Didacticiel from './Didacticiel.mjs';
QOG.prototype.scenarioParser = Parser;