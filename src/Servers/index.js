'use strict'

const web = require(./App/index.js);
// const services = require(./Services/index.js);

// services.run();

web.run(process.env.PORT);

console.log ('app launched on port '+ process.env.PORT)
