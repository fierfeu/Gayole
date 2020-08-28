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

