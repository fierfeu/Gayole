'use strict'

const web = require('./App/index.js');
// const services = require(./Services/index.js);

// services.run();
const host = (process.env.HOST?process.env.HOST:'localhost');
const port =(process.env.PORT?process.env.PORT:80);

//console.log('creation with host='+ process.env.HOST +' & PORT = '+ process.env.PORT);

web.run(host,port);

console.log ('app launched on port '+ process.env.PORT)
