'use strict'

const web = require('./webHandler.js');
const http = require('http');

let webserver;

exports.run = (hostname, port)=> {
    webserver = http.createServer(web.handler).listen(port, hostname);
};

exports.stop = () => {
    webserver.close();
};
