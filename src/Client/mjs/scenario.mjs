export default class scenario {
    constructor (scenariiListe,inputInterface,loader) {
        if (!scenariiListe) throw ('No liste of scenarii provided');
        if(Array.isArray(scenariiListe)) {
            this.scenarii= scenariiListe;
            if(inputInterface && typeof(inputInterface)!='function') this.selectInterface = inputInterface;
            if(loader)this.loader = loader;
        } else throw ('BAD liste of scenarii provided');
    }

    select () {
        this.loadData(this.showSelectInterface ());
    }

    showSelectInterface () {
        
        if (!this.selectInterface) {
            alert('Scenario par défaut : '+this.scenarii[0][0]);
            return this.scenarii[0][2];
        }
    }

    loadData (url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = this.respParse;
        xhttp.open("GET", url);
        xhttp.send();
        
    }

    respParse () {
        if((this.status >= 200 && this.status < 300) && (this.responseText != null)) 
        {
            let data = JSON.parse(this.responseText);
            if (data) {
                if(!currentScenario) throw ('ERROR need of a global scenario tostore data');
                if (currentScenario.loader) currentScenario.loader(data);
                else currentScenario.data = data;
            }
            else throw("ERROR bad JSON");
        } else if (this.status = 404) 
        {
            throw ('ERROR bad File URL or FILE unavailable');
        }
    }
}