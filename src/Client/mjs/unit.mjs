export default class unit {
    constructor (images, name, description, values) {
        if (!images||!name||!description) {throw ('ERROR : Bad data to instanciate a unit object')};
        if ((images instanceof String)||(typeof images === 'string')) {throw ('ERROR : Bad data to instanciate a unit must used an object images')};
        this.images = images;
        this.name = name;
        this.description = description;
        if(typeof values === 'object') {
            for (let prop in values) {
                this[prop] = values[prop];
            }
        }
        this.actions=[];
    }

    addAction (action) {
        if(!action.code||!action.action) throw('ERROR bad data to create an action '+action.toString());
        this.actions.push(action);
    }

    getActions() {

    }
}

export class unitSet extends unit {
    constructor (images, name, description, units) {
        super(images, name, description);
        this.units = new Array();
        if (units) { 
            if(!Array.isArray(units)) throw ('ERROR you must provide a valid array of units to instanciate a set of units');
            this.units = new Array();
            this.attach(units);
        };
    }

    attach (unitArray) {
        if(!unitArray || !Array.isArray(unitArray)) throw ('ERROR you must provide a valide array of unit');
        let nbOfUnitsAttached = 0;
        unitArray.forEach(element => {
            if(!element instanceof unit) throw ('ERROR last parameter must be an array of unit objects');
            this.units[element.name]=element;
            nbOfUnitsAttached++;
        });
        return nbOfUnitsAttached;
    }

    detach (unitArray) {
        if(!unitArray || !Array.isArray(unitArray)) throw ('ERROR you must provide a valide array of unit');
        let nbOfUnitDetached=0;
        unitArray.forEach(element =>{
            if(!element instanceof unit) throw ('ERROR last parameter must be an array of unit objects');
            if(element.name in this.units) {
                this.units[element.name]=undefined;
                nbOfUnitDetached++;
            }
        });
        return nbOfUnitDetached;
    }
}