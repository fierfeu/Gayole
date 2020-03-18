'use strict'
const chai = require('chai');
var expect=chai.expect;
const fs = require('fs');
const res = require('../App/responseFake.js');
const Handler = require ('../../../src/Servers/App/webHandler.js');

describe('[CSS TESTS] index.css existe and stored at the good place',()=>{

    it('index.css is well stored and available',()=>{
        
        expect(() => {fs.accessSync('src/Client/css/index.css')}).to.not.throw();
    })

    it('Webhandler knows the route to index.css', () =>{
        let response = new res();

        const request = {
            url : '/index.css'
        };

        Handler.handler(request,response);

        expect (response.statusCode).to.equal(200);
    });
});