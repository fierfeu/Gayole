'use strict'

module.exports = {
    validate : (url, pagesConfiguration) => {
        if (pagesConfiguration) {
            if (pagesConfiguration.hasOwnProperty(url)) {
                return 200;
            }
        }
        return 404;
    }
};