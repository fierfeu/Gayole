import unit from './unit.mjs';

export class unitSet extends unit {
    constructor (images, name, description, units, values) {
        super(images, name, description,values);
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

    getNbOfUnitsInPatrol () {
        const entities = Object.keys(this.units);
        return entities.length;
    }
}