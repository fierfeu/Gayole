'use strict'

const expect = require('chai').expect;
const urlSiteValidator = require('./../../../src/Servers/App/urlSiteValidator');

// TODO la présence d'un hash ne modifie pas le comportement de la focntion

describe("urlSiteValidator is working as expected", ()=>{
    // si l'url est vide, malformatée ou pas dans la liste des pages du domaine alors la focntion retourne le code 404
    it("should return 404 if url is empty", (done)=>{
        let url = '';

        expect(urlSiteValidator.validate(url)).to.be .equal(404);
        
        done();
    });

    it("should return 404 for dab formated url", (done) =>{
        let url ='badUrl';

        expect(urlSiteValidator.validate(url)).to.be .equal(404);
        
        done();
    });

    it("should return 404 for url not listed in site configuration", (done) => {
        let url ='/notListedUrl';
        let sitePagesConf = {
            '/' : 'index.html'
        };

        expect(urlSiteValidator.validate(url,sitePagesConf)).to.be .equal(404);
        
        done();
    });
});

describe ("urlSiteValidator returns 200 for good url", () =>{
    // Pour chaque url dans la liste des pages la fonction retourne un code 200
    
    let sitePagesConf = {
        '/' : 'index.html',
        '/index.html' : 'index.html'
    };

    it ("should return 200 for '/' access", (done)=>{
        let url ='/';

        expect(urlSiteValidator.validate(url,sitePagesConf)).to.be .equal(200);
        
        done();
    });

    it("should return 200 for '/index.html' access", (done) => {
        let url ='/index.html';

        expect(urlSiteValidator.validate(url,sitePagesConf)).to.be .equal(200);
        
        done();
    });
});