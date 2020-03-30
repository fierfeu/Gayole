'use strict'

function response () {
    this.Headers =  new Array();
    this.statusCode = 404 ;
};

response.prototype.writeHead = function (statusCode,Header) {
    this.statusCode = statusCode;
    if (Header) {
        //this.Headers += Header;
        key = objectKeys(Header);
        this.Headers[key] = Header[key];
    }
};

response.prototype.write = function (data) {this.data=data};

response.prototype.end = function () {
    this.body=this.data
};

response.prototype.setHeader = function (label,value) {
    this.Headers[label]=value;
};

module.exports = response;

