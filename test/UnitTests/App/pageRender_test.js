'use strict'
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const fs=require('fs');
const pageRender = require('../../../src/Servers/App/pageRender.js');
const res = require('./responseFake.js');

chai.use(chaiAsPromised);
var expect = chai.expect;



describe('[pageRender] pageRender.render must called res.end()', ()=> {
    it ('response.end is well used in page render', () =>{

        var response = new res ();

        sinon.spy(response,"end");

        pageRender.render(response,'./src/Client/html/index.html',200); 
        
        expect(response.end.called).to.be.true;

        response.end.restore();

    });
});

// pageRender acces to the good file through param
describe ("[pageRender] pageRender.render return good content for a given filename",()=>{

    it("return file content if file exist",()=>{
        var response = new res();

        fs.writeFileSync("testFile.txt","txt content",'utf8');

        pageRender.render(response,"./testFile.txt",200);
    
        expect(response.body).to.equal("txt content");
        expect(response.Headers['content-type']).to.equal('text/plain');

        fs.unlinkSync("testFile.txt",(err)=>{if (err) throw err;});
    });

    it ("return error 500 status if file doesn't exist",()=>{
        let response = new res();
       
        pageRender.render(response,"badFile.html")
        
        expect(response.statusCode).to.equal(500);

    });

    it ("return status code 404 if MIME type not allowed", () => {
        let response = new res();

        pageRender.render(response, "test.bad",200);

        expect (response.statusCode).to.equal(404);
    })

    it ("return the good MIME type for icons", () => {
        let response = new res();

        pageRender.render(response,"./src/Client/images/favicon.ico",200);

        expect (response.Headers['content-type']).to.equal('image/x-icon');
    });

    it("return the good MIME type for css files", ()=>{
        let response = new res();

        fs.writeFileSync("test.css","txt content",'utf8');

        pageRender.render(response,"test.css",200);
        
        expect (response.Headers['content-type']).to.equal('text/css');
        
        fs.unlinkSync("test.css",(err)=>{if (err) throw err;});
    });

    it("Return the good MIME type for jpg files", ()=>{
        let response = new res();

        fs.writeFileSync("test.jpg");

        pageRender.render(response,"test.jpg",200);
        
        expect (response.Headers['content-type']).to.equal('image/jpeg');
        
        fs.unlinkSync("test.jpg",(err)=>{if (err) throw err;});
    });
    
});
