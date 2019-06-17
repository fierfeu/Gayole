'use strict'
const urlSiteValidator = require('./urlSiteValidator.js');

module.exports ={
    handler : (req,res) => {
        urlSiteValidator.validate(req.url);
        switch (req.url) {
            case  '/' :
                res.writeHead (200,{
                    'content-type' : 'text/html',
                    'charset' : 'utf8'
                });
                res.write ('<html><head> <title>Gayole</title></head><body>hello world</body></html>');
                res.end();
            default :
                res.writeHead(404);
                res.end;
        }
    }
};
