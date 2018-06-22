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

    specs: ['test/E2E/*.js'],

    capabilities: {
        'browserName' : 'firefox'
    },

    beforeLaunch: ()=> {
        web.run('localhost',80);

        console.log ('Web app launched on port 80');
    },

    afterLaunch : (exitCode)=> {
        web.stop();

        console.log ('Web app stoped on port 80');
    }

};
