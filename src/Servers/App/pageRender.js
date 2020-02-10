'use strict'

const fs = require('fs');

const MIME = {
    'txt':'text/plain',
    'html': 'text/html',
    'ico' : 'image/x-icon'
};

module.exports = {
    render : (res,file,statusCode) =>{
        if (file) {
            let ext = file.split('.').pop();
            if (MIME[ext]) 
            {
                try {let data = fs.readFileSync(file,'utf8');
                        ext = MIME[ext];
                        res.setHeader('content-type',ext)
                        if (ext.split('/').shift()==='text'){res.setHeader('charset','utf8')};
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