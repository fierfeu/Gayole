
export default class enventStorageInterface {

    constructor(context,storageName,options) {
        if (!context || !storageName || typeof(storageName)!=="string") throw 'bad data for storage';
        let _context = context;
        this.queue = 'eventsStorageQueue';
        let _firstEventString = "DONE:eventStorageInterface init";
        this.local=true;
        if(options)  {
            if (!options['local']) this.local = options['local']
        };
        if(this.local) {
            if (_context.document) 
            {
                if (storageName == 'localStorage') {
                    try {
                        this.storage = _context.localStorage;
                        this.storage.setItem(this.queue,_firstEventString);
                    }
                    catch (e) {throw (e);}
                } else if (storageName == 'sessionStorage') {
                    try {
                        this.storage = _context.sessionStorage;
                        this.storage.setItem(this.queue,_firstEventString);
                    }
                    catch (e) {throw (e);}
                } else throw ('error in storageName : must be localStorage or sessionStorage');
            } else throw ('Error : context not a window node element');
        } else {
            if (_context.body || _context.document) {
                this.storage=storageName;
                //faire des request sur url/storageName/
            }else throw ('Error : context not a document node or a window so I can not request external url');
            //faire des request sur url/storageName/
        }
    }

    add (eventString) {
        const content = this.storage.getItem(this.queue);
        this.storage.setItem(this.queue,content+','+eventString);
    }

    last () {
        const content = this.storage.getItem(this.queue);
        const eventsArray= content.split(',');
        return eventsArray[eventsArray.length-1];
    }

    all () {
        return this.storage.getItem(this.queue).split(',');
    }
}