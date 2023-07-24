import unit from './unit.mjs';
import {unitSet} from './unitSet.mjs';
import zone from './zone.mjs';

const HIERARCHYRANKING = [['OCDT','2LT','1LT','CPT','MAJ'],['Cadet','Second Lieutnant','Lieutnant', 'Captain','Major']]
const EPTScenarioList =[["Default Scenario","This is the first scenario to learn how to play","/EPT_scenario_default.json"],["Scenarii for OCDT", ["first recognition","perform a recognition in first line","/EPT_OCDT-Rcegnition.json"]]]

const EPTPHASES = ['Initiate','Placement','Running','Ending']

export default class EPT{
    

    constructor () {
        throw('EPT interface not Instantiable')
    }


    getGameName () {
        return ('EPT')
    }

    /**
     * 
     * @this gameManager
     * @param {Object} player 
     * 
     * For use : only callable with boards.call(gameManager,player) by game.mjs
     */
    async boards (player) {
        if(player === undefined) player = {'rank':-1}
        // rank verification
        EPT.prototype.rankVerification.call(this)
        // scenario selection
        await EPT.prototype.scenarioSelection.call(this,player.rank)
        // boards import
        EPT.prototype.loadMaps.call(this)
        // hex to zone convertion
        EPT.prototype.initZones.call(this,this)
    }

    /**
     * 
     * @this gameManager
     * 
     * For use : only callable with setUp.call(gameManager,player) by game.mjs
     */
    setUp (player) {
        // Set Opponents and load data
        EPT.prototype.setOpponents.call(this,player)
        // units creation
        EPT.prototype.createUnits.call(this)
        // unit placement
        EPT.prototype.placeUnits.call(this)
    }


        /**
     * 
     * @this gameManager
     * 
     * For use : only callable with run.call(gameManager,player) by game.mjs
     */
    run () {
        
    }

    rankVerification () {

    }

    async scenarioSelection (rank) {

        if(rank ==-1) {
            this.currentScenarioName=EPTScenarioList[0][0]
            await this.loadExternalRessources({'url':EPTScenarioList[0][2]}).then ((data) =>{
                try{
                    this.currentScenarioDescriptor = JSON.parse(data)
                } catch {
                    this.currentScenarioDescriptor=data
                }
            })
        }
        else {
            this.currentScenarioName=EPTScenarioList[rank][1][0]
            await this.loadExternalRessources({'url':EPTScenarioList[rank][1][2]}).then ((data) =>{
                try{
                    this.currentScenarioDescriptor = JSON.parse(data)
                } catch (err) {
                    console.log(err)
                    this.currentScenarioDescriptor=data
                }
            })


        }
        
    }

    async loadMaps () {
        const strategicMap=document.getElementById('strategicMap')
        for (let index = 0; index <this.currentScenarioDescriptor.maps.nb; index++) {
            const element = this.currentScenarioDescriptor.maps.desc[index][0]
            await this.loadExternalRessources({'url':element}).then((data)=>{
                const div = document.createElement('div')
                div.id='map'+index
                div.insertAdjacentHTML("beforeend",data)
                const img = div.lastChild
                if(this.currentScenarioDescriptor.maps.desc[index][1]===1)
                    img.classList.toggle('verticalMap')
                strategicMap.appendChild(div)

            })
        }
        const imgs= strategicMap.getElementsByTagName('img')

    }

    initZones() {
        this.currentScenarioDescriptor.maps.data = []
        this.zones=[]
        this.currentGamePhase = EPTPHASES[0]
        for (let index = 0; index <this.currentScenarioDescriptor.maps.nb; index++) {
            let id = 'map'+index
            let element = document.getElementById(id)
            let image = element.getElementsByTagName('img')
            let idData = image[0].id
            this.currentScenarioDescriptor.maps.data[index] = window[idData]
            const map = document.createElement("map")
            map.name=id+"areas"
            map.id=map.name
            this.currentScenarioDescriptor.maps.data[index].hexs.forEach(zone => {
                const area = document.createElement('area')
                area.shape='poly'
                area.id = zone.id
                area.coords = zone.area.toString()
                map.appendChild(area)
                area.addEventListener("mouseover", EPT.prototype.zoneOverHandler)
                area.addEventListener("drop", EPT.prototype.zoneDropHandler)
                this.zones[area.id]=zone
            });

            image[0].useMap = "#"+map.name
            element.appendChild(map)
        }
        

    }

    setOpponents (player) {
        this.opponents = this.currentScenarioDescriptor.opponents
        if(player.country===undefined) {
            player.country="FR"
            player.name = "Frundefined"
        }
            
        if (player.country==this.opponents[0].player)
            this.opponents[0].player= player.name
        else if (player.country==this.opponents[1].player)
            this.opponents[1].player= player.name
    }

    createUnits () {

    }

    placeUnits () {

    }


    // Event handlers
    /**
     * zones Event Handlers
     * zoneOverHandler
     * @param {MouseEvent} event 
     */
    zoneOverHandler (event) {

    }
    /**
     * zones Event Handlers
     * zoneDropHandler
     * @param {MouseEvent} event 
     */
    zoneDropHandler (event) {

    }
}