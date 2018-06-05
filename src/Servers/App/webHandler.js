'use strict'


module.exports ={
    handler : (req,res) => {
        res.writeHead (200,{
            'content-type' : 'text/html',
            'charset' : 'utf8'
        });
        res.end();
    }
};
