'use-strict';

var express = require('express');
var bodyParser = require('body-parser');

//Require the Routers
var server = require('./server');

const eventEmitter = require('./emitter');
const reservationHandler = require('./reservation');
const publishHandler = require('./publish');
const subscriptionHandler = require('./subscribe');
const cancelHandler = require('./cancel');

//Assign the event handler to an event:
eventEmitter.on('connected', subscriptionHandler);
eventEmitter.on('registered', reservationHandler);
eventEmitter.on('saved', publishHandler);
eventEmitter.on('failed', cancelHandler);


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/reservations', server);

app.listen(process.env.NODE_PORT);