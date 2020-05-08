'use strict'

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const chai = require('chai');
var expect = chai.expect;

describe ('[Game Board] contains the good html',()=>{
    let document;
    it('is based on a div with the good id, good parent and css class',()=>{
        return JSDOM.fromFile("src/Client/html/index.html").then((dom)=>{
            document =dom.window.document;
            const gameBoard = document.getElementById('GameBoard');
            expect(gameBoard).to.exist;
            expect(gameBoard.parentNode.nodeName).to.equal('BODY');
            expect(gameBoard.className).to.equal('gameBoardHide');
        });
    });

    it ('contains 2 divs called strategicMap and dialogZone',()=>{
        return JSDOM.fromFile("src/Client/html/index.html").then((dom)=>{
            document =dom.window.document;
            const gameBoard = document.getElementById('GameBoard');
            expect(gameBoard.childNodes.length).to.equal(2);
            expect(gameBoard.childNodes[0].id).to.equal('dialogZone');
            expect(gameBoard.childNodes[0].className).to.equal('dialogZone');
            expect(gameBoard.childNodes[1].id).to.equal('strategicMap');
            expect(gameBoard.childNodes[1].className).to.equal('strategicMap');
        });
    });
});

describe ('[gameBoard] load resources',()=>{
    class CustomResourceLoader extends jsdom.ResourceLoader {
        fetch(url, options) {
            const file = url.split('/').pop();
            const ext = file.split('.').pop();
            url = "file://C:/Users/Public/DevPublique/Gayole/src/Client/"+ext+"/"+ file;
            return super.fetch(url, options);
        }
      }
    const myResourceLoader = new CustomResourceLoader();

    it('is possible to load css',()=>{
        return JSDOM.fromFile("src/Client/html/index.html",{url:"http://localhost", resources:myResourceLoader,pretendToBeVisual: true }).then((dom)=>{
            //console.log('game is launched is : '+ dom.window.localStorage.getItem ('gameLaunched'));
        });
    });
});