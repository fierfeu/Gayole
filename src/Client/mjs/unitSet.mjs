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

    /**
     * @description Add one or more units to the unitSet
     * @param {array[Unit]} unitArray unit to Add 
     * @memberof UnitSet
     * @return {int} the number of unit added to the unitSet
     */
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

    /**
     * @description Remove one or more units form the unitSet and the units are independant
     * @param {array[Unit]} unitArray unit to detach 
     * @memberof UnitSet
     * @return {int} the number of unit removed from the unitSet
     */
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

    /**
     * @description secondment allows a unit to move separatly while remaining in the Patrol
     * @param {Unit} unitToSent 
     * @memberof UnitSet
     * @return {boolean}
     */
     secondment (unitToSent) {

    }
    
    /**
     * @description the reverse of secondment function
     * @param {Unit} unitSentToRegroup 
     * @memberof UnitSet
     */
    rejoin (unitSentToRegroup) {

    }

    getNbOfUnitsInPatrol () {
        const entities = Object.keys(this.units);
        return entities.length;
    }
}