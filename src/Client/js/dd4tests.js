/** *
 * @file dd4tests.js is only for E2E test purpose
 * to load this file during E2E test use :
 * await browser.executeScript(`const script = document.createElement('script');
 *                              script.src = 'dd4tests.js';
 *                              document.body.appendChild(script);`);
 * This file contains global function you can use like this :
 * let data = await browser.executeScript(`const data = begindrag(arguments[0]);return data;`,unit2move); 
 * where origine is a valid HTMLElement
 * 
 */

/**
 * @description function intiating a drag process. 
 * Must be apply to a draggable HTMElement elsewhere it returns false
 * @author fierfeu
 * @param {HTMLElement} el a draggable HTMLElement
 * @returns {boolean} if error 
 * @returns {DataTransfert} object otherwise
 */
window.begindrag = (el) =>{
    if(el.draggable === true) {
        const data = new DataTransfer();
        const dragStart = new DragEvent('dragstart',{"dataTransfer":data});
        el.dispatchEvent(dragStart);
        return data;
    } else return false;
}

/**
 * @description simulate drag And Drop operation
 * @author fierfeu
 * @param {HTMLElement} el a valid draggable HTMLElement
 * @param {HTMLElement} zone a valid drop zone HTMLElement
 * @returns {Boolean} if something went wrong
 * @returns {DataTransfer} if action is succesfful
 */
window.dragAndDrop = (el,zone) => {
    if(el.draggable === true) {
        if ((zone.ondrop != '')&&(zone.ondropover !='')) {
            const data = new DataTransfer();
            const dragStart = new DragEvent('dragstart',{"dataTransfer":data});
            const drag = new DragEvent('drag',{"dataTransfer":data});
            const dropEnter = new DragEvent('dragenter',{"dataTransfer":data});
            const dropOver = new DragEvent('dragover',{"dataTransfer":data});
            const drop = new DragEvent('drop',{"dataTransfer":data});
            const dragEnd = new DragEvent('dragend',{"dataTransfer":data});
            el.dispatchEvent(dragStart);
            console.log('dragstart');
            el.dispatchEvent(drag)
            console.log('drag');
            zone.dispatchEvent(dropEnter);
            console.log('dropenter');
            zone.dispatchEvent(dropOver);
            console.log('dropover');
            zone.dispatchEvent(drop);
            console.log('drop');
            el.dispatchEvent(dragEnd);
            console.log('dragEnd');
            return data;
        } else return false
        
    } else return false;
}

/**
 * @description simulate drag operation on a valid droppable zone
 * @author fierfeu
 * @param {HTMLElement} el a valid draggable HTMLElement
 * @param {HTMLElement} zone a valid drop zone HTMLElement
 * @returns {Boolean} if something went wrong
 * @returns {DataTransfer} if action is succesfful
 */
 window.dragMoveAndStay = (el,zone) => {
    if(el.draggable === true) {
        if ((zone.ondrop != '')&&(zone.ondropover !='')) {
            const data = new DataTransfer();
            const dragStart = new DragEvent('dragstart',{"dataTransfer":data});
            const drag = new DragEvent('drag',{"dataTransfer":data});
            const dropEnter = new DragEvent('dragenter',{"dataTransfer":data});
            const dropOver = new DragEvent('dragover',{"dataTransfer":data});
            el.dispatchEvent(dragStart);
            el.dispatchEvent(drag);
            zone.dispatchEvent(dropEnter);
            zone.dispatchEvent(dropOver);
            return data;
        } else return false
        
    } else return false;
}