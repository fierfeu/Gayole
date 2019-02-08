'use strict'

const web = require('./webHandler.js');
const http = require('http');

let webserver; // instance de server web pour les accès en http


exports.run = (hostname, port)=> {
    webserver = http.createServer(web.handler).listen(port, hostname);
};

exports.stop = () => {
    webserver.close();
};
