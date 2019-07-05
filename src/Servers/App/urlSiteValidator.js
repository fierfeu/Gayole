'use strict'
const URL = require('url');

module.exports = {
    validate : (url, pagesConfiguration) => {
        if (pagesConfiguration) {
            const parsedUrl = URL.parse(url);
            if (pagesConfiguration.hasOwnProperty(parsedUrl.pathname)) {
                return 200;
            }
        }
        return 404;
    }
};