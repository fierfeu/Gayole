import unit from './unit.mjs';

export default class zone {
    constructor (htmlElement,name,values) {
        if(!htmlElement||!name) throw('ERROR No HTMLElement or nma to instanciate');
        if(!(htmlElement.tagName=='DIV'||htmlElement.tagName=='AREA')) throw('ERROR bad HTMLElement provided');
        this.Element=htmlElement;
        this.name=name;
        if( values ) {
            if(typeof values != 'object') throw ('ERROR additional values must be stored in an object');
            for (let prop in values) this[prop]=values[prop];
        }
        this.connections ={};
        this.units = [];
    }

    linkTo(targetZone,cost) {
        if(!targetZone||!(targetZone instanceof zone)) throw('ERROR bad data to create a link use a zone instance');
        if(targetZone === this) throw ('ERROR no reflexive link allowed');
        if(!cost) cost=0;
        this.connections[targetZone.name]=cost;
    }
    /**
     * @description retunr an collection of key/values paire for all the zone connected to the current one
     * @author fierfeu
     * @returns {Object{zoneName:cost}} 
     * @memberof zone
     */
    connectedZones () {
        return this.connections
    }
    /**
     * @description
     * @author fierfeu
     * @param {*} targetZone
     * @returns {*} 
     * @memberof zone
     */
    moveAllowedTo(targetZone) {
        if(!targetZone||!(targetZone instanceof zone)) return 'instance';
        if (this.connections[targetZone.name]) return parseFloat(this.connections[targetZone.name]);
        return 'not linked';
    }

    attach (unitToAttach) {
        if(!unitToAttach||!(unitToAttach instanceof unit)) throw ('ERROR you try to attach something wich is not a unit');
        this.units[unitToAttach.name]=unitToAttach;
    }

    /**
     * @description define if the given unit is in the curretn zone
     * @author fierfeu
     * @param {Unit} unit2verif
     * @returns {boolean} 
     * @memberof zone
     */
    isInZone(unit2verif) {
        if(!unit2verif ) throw ('ERROR isInZone fct : you must provide at least a unit to test');
        if(!(unit2verif instanceof unit)) throw ('ERROR isInZone fct can only test valide unit instance')
        let result = false;       
        for (let [unitName,UnitObj] of Object.entries(this.units)) {
            if(UnitObj == unit2verif) {
                result = true;
                break;
            }
        } 
        return result;
    }

    getGround() {
        console.log (this.ground)
        if(this.ground == undefined) return false
        else {
            return this.ground
        }
    }

    moveTo(destZone,unit2move) {
        if(!destZone) throw ('ERROR you must specify at least a destination zone');
        if(unit2move) {
            if(!(destZone instanceof zone)) throw('ERROR the good parameter order is areaZone and MyUnit');
            if(!(unit2move instanceof unit)) throw ('ERROR if you specify an second paramater it must be a valide instance of unit');
            if (this.moveAllowedTo(destZone)==='not linked') return false;
            destZone.attach(unit2move);
            this.units[unit2move.name]=undefined;
            return true;
        }
        else if(!(destZone instanceof zone)) throw ('ERROR you must specify at least a valid destination zone');
        
    }
}