'use strict'
const urlSiteValidator = require('./urlSiteValidator.js');
const targetDefinition = require('./targetDefinition.js');

// Definition de la structure du site em mode KISS
const sitePagesConf ={
    '/':'index.html',
    '/index.html':'index.html'
};

module.exports ={

    handler : (req,res) => {
        const code = urlSiteValidator.validate(req.url,sitePagesConf);
        res.writeHead (code,{
            'content-type' : 'text/html',
            'charset' : 'utf8'
        });
        if (code===200) {
                const target = targetDefinition.resolved(req.url,sitePagesConf);
                res.write ('<html><head> <title>Gayole</title></head><body>hello world</body></html>');
                res.end();
        }
    }
};
