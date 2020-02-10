'use strict'

const expect = require('chai').expect;
const http = require('http');
const app = require ('../../../src/Servers/App/index.js');

describe ('[App_Launcher] webApp should run on localhost',() => {
    let port = (process.env.PORT) ? process.env.PORT : 80;

    before(()=>{
        console.log(port);
        app.run('localhost',port);
    });

    after (()=>{
        app.stop();
    });

    it('should return 200 to localhost',(done)=>{
        let url= 'http://localhost:'+port;
        console.log (url);
        http.get(url,(res) => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
})
