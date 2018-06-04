'use strict'

const expect = require('chai').expect;
const http = require('http');
const app = require ('../../../src/Servers/App/index.js');

describe ('webAppshould run on localhost',() => {
    before(()=>{
        app.run('localhost',8080);
    });

    after (()=>{
        app.stop();
    });

    it('should return 200 to localhost',(done)=>{
        http.get('http://localhost/',(res) => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
})
