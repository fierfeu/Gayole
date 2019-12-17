'use strict'

module.exports = {
    writeHead : (statusCode,Header) => {
        this.statusCode = statusCode;
        if (Header) {this.Headers += Header;}
    },
    write : (data) => {this.data+=data},
    end : () => {
        //console.log(this.data);
        this.body=this.data
    },
    setHeader : (label,value) => {this.Headers += '{'+ label +' : '+ value +'}'},
};

