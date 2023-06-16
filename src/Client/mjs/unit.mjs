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

    /**
     * @description perform an action if atached to the unit
     * @param {HTMLEment.id} actionId 
     */
    performAction(actionId) {
        if (typeof this.actions[actionId] == undefined) throw ("ERROR the requested action was'nt define fo this unit");
    }

    getDescription () {
        if(!this.HTMLDescription) {
            this.HTMLDescription = '<div class="description"><span>'+this.name+'<span><hr><span>'+
                this.description+'<span><div>';
        }
        return this.HTMLDescription;
    }
}

