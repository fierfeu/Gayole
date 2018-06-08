'use strict'

const app = require(./App/index.js);
const services = require(./Services/index.js);

// services.run();

app.run(process.env.PORT);

console.log ('app launched on port '+ process.env.PORT)
