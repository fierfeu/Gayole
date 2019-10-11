'use strict'
const expect = require('chai').expect;
const sinon = require('sinon');
const pageRender = require('../../../src/Servers/App/pageRender.js');
const fs = require('fs');

var response ={
    writeHead (statusCode,statusMessage) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    },
    write (data) {this.data+=data},
    end () {this.body=this.data},
};


describe('pageRender.render must return good code', ()=> {
    it('pageRender must called res.send', ()=>{
        sinon.spy(response,'end');

        pageRender.render(response);

        expect(response.end.calledOnce).to.be.true;

        response.end.restore();
    });
    it('pageRender acces to the good file given through target definition param',()=>{
        let target='test.test';
        let targetContent='test Ok';
        fs.appendFile(target,targetContent, ()=>{});

        pageRender.render(response,target);

        expect(response.body).to.equal(targetContent);

        fs.unlink(target, ()=>{});
    });
});



// pageRender write the good file content

// pageRender write the good status code and file format