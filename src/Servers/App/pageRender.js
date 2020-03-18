'use strict'

const fs = require('fs');

const MIME = {
    'txt':'text/plain',
    'html': 'text/html',
    'css' : 'text/css',
    'jpg' : 'image/jpeg',
    'ico' : 'image/x-icon'
};

module.exports = {
    render : (res,file,statusCode) =>{
        if (file) {
            let ext = file.split('.').pop();
            if (MIME[ext]) 
            {
                ext = MIME[ext];
                res.setHeader('content-type',ext)
                let encoding;
                if (ext.split('/').shift()==='text'){encoding='utf8'}
                else {encoding ='base64'};
                try {let data = fs.readFileSync(file,encoding);
                        res.setHeader('charset',encoding)
                        let contentToWrite = data;
                        res.writeHead(statusCode);
                        res.write(contentToWrite);
                        res.end();
                    }
                    catch(err) {
                        let contentToWrite = '<body>Access to target not allowed</body>';
                        res.writeHead(500);
                        res.write(contentToWrite);
                        res.end();
                    };
            } 
            else 
            {
                let contentToWrite = "Eror 404";
                res.writeHead(404);
                res.write(contentToWrite);
                res.end();
            };
        } else {
            throw Error("[PageRender.render] Mais pourquoi il n'y a pas de fucking file ?")
        };
    }

};