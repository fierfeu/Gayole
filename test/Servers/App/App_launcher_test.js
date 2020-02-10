'use strict'

const expect = require('chai').expect;
const http = require('http');
const app = require ('../../../src/Servers/App/index.js');

describe ('[App_Launcher] webApp should run on localhost',() => {
    before(()=>{
        let port = process.env.PORT || 80;
        console.log(port);
        app.run('localhost',port);
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
