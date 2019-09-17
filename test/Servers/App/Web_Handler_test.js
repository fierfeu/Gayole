'use strict'

const expect = require('chai').expect;
const sinon = require('sinon');
//const sandbox = require('sinon').createSandbox;
const Handler = require ('../../../src/Servers/App/webHandler.js');
const urlSiteValidator = require('../../../src/Servers/App/urlSiteValidator.js');
const targetDefinition = require('../../../src/Servers/App/targetDefinition.js');
const pageRender = require('../../../src/Servers/App/pageRender.js');

var response ={
    writeHead (statusCode,statusMessage) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    },
    write (data) {this.data+=data},
    end () {this.body=this.data},
};

describe ("tests accès / du web handler de l'app",()=>{
    
    let request= {
        url : '',
    };

    it("should return good html when accessing throught /", (done) => {
        request.url = '/';

        Handler.handler(request,response);

        expect(response.body, "has no valid html tags").to.include('<html>').and.include ('</html>');
        expect(response.body, "has no valid head tags").to.include('<head>').and.include ('</head>');
        expect(response.body, "has no valid body tags").to.include('<body>').and.include ('</body>');
        done();
    });

    it ("should return 404 for bad url",(done) =>{
        request.url ='/bad';

        Handler.handler(request,response);

        expect (response.statusCode).to.equal(404);
        done();
    });


});


describe ('webhandler used urlSiteValidator', () => {
    
    //On passe obligatoirement par la fct de validation pour ttes les requètes
    it("must used urlSiteValidator.validate for any call to webHandler", (done) =>{
        
        sinon.spy(urlSiteValidator,'validate');
        let request = {
            url :'myUrl',
        };
        
        Handler.handler(request,response);
        
        expect(urlSiteValidator.validate.calledOnceWith('myUrl')).to.be.true;
        urlSiteValidator.validate.restore();

        done();
    });
});

    
describe ('webhandler used targetDefinition',()=>{
    // On passe obligatoirement par la définition de la page et du fichier de rendu associé
    it("must used target definition if code 200",()=>{
        sinon.spy(targetDefinition,'resolved');
        const request ={
            url : '/',
        };

        Handler.handler(request,response);

        expect(targetDefinition.resolved.calledOnceWith('/')).to.be.true;

        targetDefinition.resolved.restore();
    });

    it("targetDefinition not called if return code is not 200", ()=>{
        sinon.spy(targetDefinition,'resolved');
        
        const request = {
            url : 'badUrl'
        };

        Handler.handler(request,response);

        expect(targetDefinition.resolved.calledOnceWith('badUrl/')).to.be.false;

        targetDefinition.resolved.restore();
    });

});

    // TODO la fonction d'identification de la target est la seconde fonction
describe("targetDefinition must be called after url validation", ()=>{
    it("verification test", ()=>{
        sinon.spy(targetDefinition,'resolved');
        sinon.spy(urlSiteValidator,'validate');

        const request = {
            url : '/'
        };

        Handler.handler(request,response);

        expect(targetDefinition.resolved.calledAfter(urlSiteValidator.validate)).to.be.true;

        targetDefinition.resolved.restore();
        urlSiteValidator.validate.restore();
    });
});

    // TODO On passe par la vérification des droits d'accès obligatoirement

    // TODO la fonction de verification des droits est la troisème fonction

    // TODO On passe par l'application du contexte à la page

    // TODO l'application du contexte est obligatoirement en quatrième position

describe("Webhandler must go through page rendering function",()=>{
    beforeEach ( () => {
        sinon.spy(pageRender,'render');
    });

    afterEach ( ()=>{
        pageRender.render.restore();
    });
    it("must used pageRender function with good url",()=>{
   
        const request = {
            url : '/'
        };

        Handler.handler(request,response);

        expect(pageRender.render.calledOnce).to.be.true;
    });
    it("must used pageRender function with bad url",()=>{

        const request = {
            url : 'badUrl'
        };

        Handler.handler(request,response);

        expect(pageRender.render.calledOnce).to.be.true;
    });  
});

    // TODO le rendu est obligatoirment la dernière fonction    
describe ('pageRender is the latest function of web handler', () => {
    beforeEach ( () => {
        sinon.spy(pageRender,'render');
    });

    afterEach ( ()=>{
        pageRender.render.restore();
    });
    // TODO if good url pageRender.render must be run after targetDefinition.resolved
    it ('if good url pageRender.render must be run after targetDefinition.resolved',()=>{
        sinon.spy(targetDefinition,'resolved');

        const request = {
            url : '/'
        };

        Handler.handler(request,response);

        expect(pageRender.render.calledAfter(targetDefinition.resolved)).to.be.true;

        targetDefinition.resolved.restore();
    });
    // TODO if bad url pageRender.render must be run after urlSiteValidator.validate
    it('if bad url pageRender.render must be run after urlSiteValidator.validate',()=>{
        sinon.spy(urlSiteValidator,'validate');

        const request = {
            url : 'badUrl'
        };

        Handler.handler(request,response);

        expect(pageRender.render.calledAfter(urlSiteValidator.validate)).to.be.true;

        urlSiteValidator.validate.restore();
    });
});