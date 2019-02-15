const stan = require('./stan');
const eventEmitter = require('./emitter');

var subscriptionHandler = function() {
  // Subscriber can specify how many existing messages to get.
  var opts = stan.subscriptionOptions().setDeliverAllAvailable();
  var subscription = stan.subscribe(process.env.QUEUE_EVENT_TO_SUBSCRIBE, opts);
  subscription.on('message', function(msg) {
    console.log(
      'Received a message [' + msg.getSequence() + '] ' + msg.getData()
    );
    //Fire the 'registered' event:
    eventEmitter.emit('registered', JSON.parse(msg.getData()));
  });
};

module.exports = subscriptionHandler;
