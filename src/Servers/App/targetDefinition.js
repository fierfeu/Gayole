'use strict'
URL = require('url');

module.exports = {
    resolved : (url,pagesConfiguration) =>{
        const parsedUrl = URL.parse(url);

        if (pagesConfiguration.hasOwnProperty(parsedUrl.pathname)) {
            return pagesConfiguration[parsedUrl.pathname];
        }
        //else console.error("Target DEfinition : undefined target key but code 200 OK : how can it be possible ?");
    }
};