'use strict'

const web = require('./App/index.js');
// const services = require(./Services/index.js);

// services.run();

console.log('creation with host='+ process.env.HOST +' & PORT = '+ process.env.PORT);

web.run(process.env.HOST,process.env.PORT);

console.log ('app launched on port '+ process.env.PORT)
