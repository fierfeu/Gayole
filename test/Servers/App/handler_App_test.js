'use strict'

const expect = require('chai').expect;
const http = require('http');
const web = require ('../../../src/Servers/App/webHandler.js');

const URLROOT = 'http://localhost:8008'; // we use 8008 to be able to launch test on staging and prod where web is on port 80 or port 8080

describe ('[handler_App] Gayole Web handler basic test', ()=>{

    let server;

    before (() => {
        server = http.createServer(web.handler).listen('8008');
    });
    
    after (()=>{
        server.close();
    });

    it('handler should return code 200 for root access',(done)=>{
        http.get(URLROOT, (res)=>{
            expect (res.statusCode).to.be.equal(200);
            done();
        });
    });

    it('handler should return good html content type', (done) => {
        http.get(URLROOT, (res) => {
            expect (res.headers['content-type']).to.be.equal('text/html');
            done();
        });
    });

    it('handler should return charset to utf8', (done)=> {
        http.get(URLROOT, (res)=>{
            expect (res.headers['charset']).to.be.equal('utf8');
            done();
        });
    });

    it('handler should return 200 for favicon',(done)=>{
        http.get(URLROOT+'/favicon.ico', (res)=>{
            expect (res.statusCode).to.equal(200);
            done();
        });
    });

});


