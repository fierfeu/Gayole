import chai from 'chai';
const expect = chai.expect;

import jsdom from 'jsdom';
const {JSDOM} = jsdom;

import zone from '../../../src/Client/mjs/zone.mjs';
import unit from '../../../src/Client/mjs/unit.mjs';

describe ('[Game Board] contains the good html',()=>{
    let document;
    it('is based on a div with the good id, good parent and css class',()=>{
        return JSDOM.fromFile("src/Client/html/index.html").then((dom)=>{
            document =dom.window.document;
            const gameBoard = document.getElementById('gameBoard');
            expect(gameBoard).to.exist;
            expect(gameBoard.parentNode.nodeName).to.equal('BODY');
            expect(gameBoard.className).to.equal('gameBoardHide');
        });
    });

    it ('contains 2 divs called strategicMap and dialogZone',()=>{
        return JSDOM.fromFile("src/Client/html/index.html").then((dom)=>{
            document =dom.window.document;
            const gameBoard = document.getElementById('gameBoard');
            expect(gameBoard.childNodes.length).to.equal(2);
            expect(gameBoard.childNodes[0].id).to.equal('dialogZone');
            expect(gameBoard.childNodes[0].className).to.equal('dialogZone');
            expect(gameBoard.childNodes[1].id).to.equal('strategicMap');
            expect(gameBoard.childNodes[1].className).to.equal('strategicMap');
        });
    });
});

class CustomResourceLoader extends jsdom.ResourceLoader {
    fetch(url, options) {
        const file = url.split('/').pop();
        const ext = file.split('.').pop();
        url = "file://C:/Users/Public/DevPublique/Gayole/src/Client/"+ext+"/"+ file;
        return super.fetch(url, options);
    }
  }

describe ('[gameBoard] load resources',()=>{

    const myResourceLoader = new CustomResourceLoader();

    it('is possible to load css',()=>{
        expect(()=>{JSDOM.fromFile("src/Client/css/index.css",{pretendToBeVisual: true })}).to.not.throw();
    });

    // il faudrait ajouter tout les tests sur les AREA comme par exemple :
    it('Possible to load all zones and create links',async ()=>{
        let document;
        return JSDOM.fromFile('src/Client/html/boardGame.html').then((dom)=>{
            document=dom.window.document;
            let zones=[];
            const map= document.getElementsByName('gameBoardMap');
            const gameZones = map[0].areas;
            for(let area=0; area< gameZones.length;area++) {
                zones[gameZones[area].id]= new zone (gameZones[area],gameZones[area].id)
            };
            expect(Object.keys(zones).length).to.equal(map[0].areas.length);
            expect(()=>{
                for (let areaZone in zones ) {
                    if(zones[areaZone].Element.dataset.links) {
                        let sourceZone=zones[areaZone].Element;
                        sourceZone=sourceZone.dataset.links.split(';');
                        for (let i=0;i<sourceZone.length;i++) {
                            const name = sourceZone[i].split(':')[0];
                            const cost = sourceZone[i].split(':')[1];
                            zones[areaZone].linkTo(zones[name],cost);
                        };
                        
                    };
                };
            }).to.not.throw(); //we're abble to read all areas dta-links attribute.
            
        });
        
    });
});

describe('[DIALOG] html game board definition contain a dialog window',()=>{
    const myResourceLoader = new CustomResourceLoader();

    it('has a div called "dialogWindow to be compatible with gameManager',()=>{
        
        return JSDOM.fromFile('src/Client/html/boardGame.html').then((dom)=>{
            let document=dom.window.document;
            expect(document.getElementById('dialogWindow')).to.exist;
            expect(document.getElementById('dialogWindow').classList.contains('dialogWindow')).to.true;
            expect(document.getElementById('dialogWindow').classList.contains('gameBoardHide')).to.true;;
        });
    });
})