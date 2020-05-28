export default class scenario {
    constructor (scenariiListe,inputInterface,loader) {
        if (!scenariiListe) throw ('No liste of scenarii provided');
        if(Array.isArray(scenariiListe)) {
            this.scenarii= scenariiListe;
            if(inputInterface && typeof(inputInterface)!='function') this.selectInterface = inputInterface;
            if(loader && typeof(inputInterface)=='function' )this.loader = loader;
        } else throw ('BAD liste of scenarii provided');
    }

    select () {
        return this.loadData(this.showSelectInterface ());
    }

    showSelectInterface () {
        
        if (!this.selectInterface) {
            alert('Scenario par défaut : '+this.scenarii[0][0]);
            return this.scenarii[0][2];
        }
    }

    loadData () {
        return this.data = {
            "units":[
                {"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol",
                "description":"my first patrol in game"}],
            "zones":{"Siwa":"1st Patrol"}
            };
    }
}