const MINIFIED = 0;
const MAXIFIED = 1;

//const jsdom = require("jsdom");

class Menu {
    constructor (HTMLElement, minifiedClassName,maxifiedClassName) {
        this.elm = HTMLElement;
        this.Id = this.elm.id;
        this.menuState = MINIFIED;
        this.classNames = Array();
        if(minifiedClassName) {
            this.classNames[MINIFIED]=minifiedClassName;
            this.currentClass=this.classNames[this.menuState];
            this.elm.className=this.currentClass;
        };
        if (maxifiedClassName) this.classNames[MAXIFIED]=maxifiedClassName;
    }

    toggle () {
        if(this.classNames.length<2) {throw new Error('!Not enought className defined for this menu to let you toggle')};
        if (this.menuState===MINIFIED) this.menuState = MAXIFIED;
        else this.menuState = MINIFIED;
        this.currentClass=this.classNames[this.menuState];
        this.elm.classList.toggle(this.classNames[MAXIFIED]);
    }
    
}

try {module.exports = Menu}
catch{};