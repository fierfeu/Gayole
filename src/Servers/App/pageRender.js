'use strict'

const fs = require('fs');

const MIME = {
    'txt':'text/plain',
    'html': 'text/html'
};

module.exports = {
    render : (res,file,statusCode) =>{
        let contentToWrite='';
        if (file) {
            fs.readFile(file, (err,data) => {
                if (err) {
                    statusCode=500;
                    contentToWrite = '<body>Access to target not allowed</body>';
                } else {
                    let ext = file.split('.').pop();
                    if (MIME[ext]) {ext = MIME[ext]} else {throw Error("[pageRender.render]not supported file extension")};
                    res.setHeader('content-type',ext)
                    if (ext.split('/').shift()==='text'){res.setHeader('charset','utf8')};
                    contentToWrite = data;

                };
                res.writeHead(statusCode);
                res.write(contentToWrite);
                res.end();
              });
        } else {
            throw Error("[PageRender.render] Mais pourquoi il n'y a pas de fucking file ?")};
    }
};