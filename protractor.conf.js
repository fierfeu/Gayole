'use strict'

const web = require('./src/Servers/App/index.js');

exports.config = {

    directConnect: true,

    baseUrl:
      (process.env.WEB_HOST || 'http://localhost')+':'+(process.env.PORT ||80),

    framework : 'mocha',

    mochaOpts : {
        timeout : 10000
    },

    specs : ['test/E2E/*.js'],

    //seleniumAddress: 'http://localhost:4444/wd/hub',

    /*capabilities : {
        browserName : 'firefox',
        firefoxOptions : {
            args : ['--headless', '--no-sandbox']
        }
    },*/

    multiCapabilities: [
        {'browserName': 'firefox',
            firefoxOptions: {
                args : ['--headless','--no-sandbox']
            }
        },
        {'browserName': 'chrome',
            chromeOptions:{
                args: ['--headless','--no-sandbox',"--disable-gpu"]
            }
        }
    ],

    onPrepare : () => {
        browser.ignoreSynchronization = true;
    },

    beforeLaunch : ()=> {
        web.run('localhost', process.env.PORT || 80);
    },

    afterLaunch : (exitCode)=> {
        web.stop();
    }

};
