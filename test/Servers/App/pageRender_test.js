'use strict'
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const fs=require('fs');
const pageRender = require('../../../src/Servers/App/pageRender.js');
const response = require('./responseFake.js');

chai.use(chaiAsPromised);
var expect = chai.expect;


describe('pageRender.render must called res.end()', ()=> {
    it ('response.end is well used in page render', () =>{
        sinon.spy(response,'end');

        return pageRender.render(response,"./src/Client/html/index.html",200);
        
        expect(response.end.calledOnce).to.be.true;

        response.end.restore();

    });
});

// pageRender acces to the good file through param
describe ("pageRender.render return good content for a given filename",()=>{

    it("return file content if file exist",()=>{
        response.body='';
        response.data='';

        fs.writeFile("testFile.txt","txt content",(err)=>{if (err) throw err;});

        return pageRender.render(response,"./testFile.txt",200);
    
        expect(response.body).to.equal("txt content");
        expect(response.Headers['content-type']).to.equal('text/plain');

        

        fs.unlink("testFile.txt",(err)=>{if (err) throw err;});
    });

    it ("return error 500 status if file doesn't exist",()=>{
       
        return pageRender.render(response,"badFile.bad");

        expect(response.statusCode).to.equal(500);
    });

    it ("return the good MIME type for icons", () => {

        return pageRender.render(response,"favicon.ico",200);

        expect (response.Headers[content-type]).to.equal('image/x-icon');
    });
});
