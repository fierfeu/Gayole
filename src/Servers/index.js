'use strict'

const web = require('./App/index.js');
// const services = require(./Services/index.js);

// services.run();
process.env.HOST='localhost';
process.env.PORT=80;

console.log('creation with host='+ process.env.HOST +' & PORT = '+ process.env.PORT);

web.run(process.env.HOST,process.env.PORT);

console.log ('app launched on port '+ process.env.PORT)
