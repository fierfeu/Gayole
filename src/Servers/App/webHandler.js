'use strict'
const urlSiteValidator = require('./urlSiteValidator.js');

// Definition de la structure du site em mode KISS
const sitePagesConf ={
    '/':'index.html',
    '/index.html':'index.html'
};

module.exports ={

    handler : (req,res) => {
        const code = urlSiteValidator.validate(req.url,sitePagesConf);
        switch (req.url) {
            case  '/' :
                res.writeHead (code,{
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
