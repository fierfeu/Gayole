export default class scenario {
    constructor (scenariiListe,inputInterface,loader) {
        if (!scenariiListe) throw ('No liste of scenarii provided');
        if(Array.isArray(scenariiListe)) {
            this.scenarii= scenariiListe;
            if(inputInterface) this.selectInterface = inputInterface;
            if(loader)this.loader = loader;
        } else throw ('BAD liste of scenarii provided');
    }

    select () {
        this.loadData(this.showSelectInterface ());
    }

    showSelectInterface () {
        return this.scenarii[0][2];
    }

    loadData () {
        this.data = {
            "units":[
                {"images":{"recto":"/patrol1.png"},
                "name":"1st Patrol",
                "description":"my first patrol in game"}],
            "zones":{"Siwa":"1st Patrol"}
            };
    }
}