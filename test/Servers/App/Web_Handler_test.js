'use strict'

const expect = require('chai').expect;
const sinon = require('sinon');
//const sandbox = require('sinon').createSandbox;
const Handler = require ('../../../src/Servers/App/webHandler.js');
const urlSiteValidator = require('../../../src/Servers/App/urlSiteValidator.js');

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