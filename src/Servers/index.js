'use strict'

const app = require(./App/index.js);
const services = require(./Services/index.js);

// services.run();

app.run('localhost',process.env.PORT||80);
