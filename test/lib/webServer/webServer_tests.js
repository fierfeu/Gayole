'use strict'

const expect = require('chai').expect;
const sinon = require('sinon');
const http = require('http');
const webserver = require ('../../../lib/webServer/webServer.js');

describe('test webserver lib', ()=> {
    it('should answer status code 200 to localhost when I launch the server', () => {
        webserver.start('8080');
        http.get('http://localhost:8080',(res)=>{
            expect(res.statusCode).to.be.equal(200);
        });
        webserver.stop();
    });
});


describe('test route for webServer', ()=>{
    beforeEach ( ()=> {

        this.res=sinon.spy();

        webserver.start('8080');

    });

    afterEach (() => {
        webserver.stop();
    });

    it ('should pass', () => {
        http.get('http://localhost:8080', (res)=>{
            console.log(res);
        });
    });
});
