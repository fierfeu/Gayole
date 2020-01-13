'use strict'

const web = require('./webHandler.js');
const http = require('http');
const fs = require('fs');

let webserver; // instance de server web pour les accès en http


exports.run = (hostname, port)=> {
    let log ='';

    webserver = http.createServer(web.handler);

    webserver.on('connection',(socket)=>{
        let now =new Date();
        log = socket.remoteAddress + ' - - ' + now.toString() +' ';
    });

    webserver.on ('request',(req,res)=>{
        log += req.method + ' ' + req.url + ' ' + req.httpVersion + ' ' +res.statusCode + ' - \r';
        fs.appendFile('webServer.log',log,()=>{});
    });
    webserver.listen(port, hostname);
};

exports.stop = () => {
    webserver.close();
};
