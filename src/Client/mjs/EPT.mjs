const HIERARCHYRANKING = [['OCDT','2LT','1LT','CPT','MAJ'],['Cadet','Second Lieutnant','Lieutnant', 'Captain','Major']]
const EPTScenarioList =[["Default Scenario","This is the first scenario to learn how to play","/EPT_scenario_default.json"],["Scenarii for OCDT", ["first recognition","perform a recognition in first line","/EPT_OCDT-Rcegnition.json"]]]

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
    setUp () {
        // units creation
        EPT.prototype.unitCreation(this)
        // unit placement
        EPT.prototype.placeUnits(this)
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

    initZones(gameManager) {

    }

    unitCreation (gameManager) {

    }

    placeUnits (gameManager) {

    }
}