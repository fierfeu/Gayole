import chai from 'chai';
const expect = chai.expect;

import jsdom from 'jsdom';
const {JSDOM} = jsdom;

import zone from '../../../src/Client/mjs/zone.mjs';

describe ('[index.html] contains the good html',()=>{
    let document;
    before(async () => {
        const _jsdom = await JSDOM.fromFile("src/Client/html/index.html")
        document = _jsdom.window.document
    });

    it('body childs are well defined (left diag, upper diag, gameboard, footer)', () => {
        const body= document.body
        expect(body.hasChildNodes()).to.true
        const bodyChilds = body.childNodes
        let divArray=[]
        for (const node of bodyChilds) {
            if (node.nodeName != "#text")
                divArray.push(node)
        }
        expect(divArray.length).to.equal(3)
    });

    it('has a left dialog zone containing main menu', () => {
        // body has a left dialog zone
        const zone = document.getElementById('leftDialogZone')
        expect(zone).to.exist
        expect(zone.parentNode.nodeName).to.equal('BODY');
        // this left zone contains main menu and VaeVictis link
        const zoneContent = zone.childNodes
        expect(zoneContent[1].nodeName).to.be.equal("DIV")
        expect(zoneContent[1].id).to.be.equal("mainMenu")
        expect(zoneContent[3].nodeName).to.be.equal("DIV")
        expect(zoneContent[3].id).to.be.equal("VVlink")
        expect(zoneContent[3].childNodes[1].href).to.be.equal("https://www.vaevictismag.fr/")
    });

    it('is based on a div with the good id, good parent and css class',()=>{
        const gameBoard = document.getElementById('gameBoard');
        expect(gameBoard).to.exist;
        expect(gameBoard.parentNode.nodeName).to.equal('BODY');
        expect(gameBoard.className).to.equal('gameBoardHide');
     });

    /*it ('contains 2 divs called strategicMap and dialogZone',()=>{
        return JSDOM.fromFile("src/Client/html/index.html").then((dom)=>{
            document =dom.window.document;
            const gameBoard = document.getElementById('gameBoard');
            expect(gameBoard.childNodes.length).to.equal(5); // tab = text node : text div text div text
            expect(gameBoard.childNodes[1].id).to.equal('dialogZone');
            expect(gameBoard.childNodes[1].className).to.equal('dialogZone');
            expect(gameBoard.childNodes[3].id).to.equal('strategicMap');
            expect(gameBoard.childNodes[3].className).to.equal('strategicMap');
        });
    });*/
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
        return JSDOM.fromFile('src/Client/html/QOG_boardGame.html').then((dom)=>{
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
        
        return JSDOM.fromFile('src/Client/html/QOG_boardGame.html').then((dom)=>{
            let document=dom.window.document;
            expect(document.getElementById('dialogWindow')).to.exist;
            expect(document.getElementById('dialogWindow').classList.contains('dialogWindow')).to.true;
            expect(document.getElementById('dialogWindow').classList.contains('gameBoardHide')).to.true;;
        });
    });
})

describe ('[GameQOG Run] html must contain movement HMI',()=>{
    it('contains a div with id cost to give data to user when drag and drop units',()=>{
        return JSDOM.fromFile('src/Client/html/QOG_boardGame.html').then((dom)=>{
            let document=dom.window.document;
            
            expect(document.getElementById('MVTcost')).to.exist;
            const costDir = document.getElementById('MVTcost');
            expect(costDir.classList.contains('dialogWindow')).to.true;
            expect(costDir.classList.contains('gameBoardHide')).to.true;
            expect(costDir.style.backgroundImage).to.equal('url(/PA.png)');
            expect(costDir.style.backgroundPosition).to.equal('center');
            expect(costDir.style.backgroundSize).to.equal('contain');
            expect(costDir.style.backgroundRepeat).to.equal('no-repeat');
            expect(costDir.style.fontFamily).to.equal('\'mainMenuTitleFont\'');
            expect(costDir.style.padding).to.equal('5px');
        });
    })
})