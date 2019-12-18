'use strict'
const urlSiteValidator = require('./urlSiteValidator.js');
const targetDefinition = require('./targetDefinition.js');
const pageRender = require('./pageRender.js');

// Definition de la structure du site em mode KISS
const sitePagesConf ={
    '/':'./src/Client/html/index.html',
    '/index.html':'./src/Client/html/index.html',
    '/favicon.ico' : './src/Client/images/favicon.ico'
};

module.exports ={

    handler : (req,res) => {
        let code = 404;
        let target ='./src/Client/html/404.html'; //TODO remove this hard coded value but today it's simple
        code = urlSiteValidator.validate(req.url,sitePagesConf);
        if (code===200) {
                target = targetDefinition.resolved(req.url,sitePagesConf);
        };
        pageRender.render(res,target,code);
    
    }
};
