'use-strict';

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
