const clientId = `client_${new Date().getTime()}`;
const clusterName = process.env.QUEUE_CLUSTER_NAME;

var stan = require('node-nats-streaming').connect(clusterName, clientId);
const eventEmitter = require('./emitter');

stan.on('connect', function() {
  eventEmitter.emit('connected');
  console.log("connected!!!");
});

module.exports = stan;
