const stan = require('./stan');
const eventEmitter = require('./emitter');

var subscriptionHandler = function() {
  var opts = stan.subscriptionOptions();
  opts.setDeliverAllAvailable();
  opts.setDurableName(process.env.QUEUE_CLIENT_NAME);
  let subscription = stan.subscribe(process.env.QUEUE_EVENT_REGISTER_INSERTED, opts);
  subscription.on('message', function(msg) {
    console.log(
      'Received a message [' + msg.getSequence() + '] ' + msg.getData()
    );
    //Fire the 'registered' event:
    eventEmitter.emit('registered', JSON.parse(msg.getData()));
  });

  subscription = stan.subscribe(process.env.QUEUE_EVENT_PAYMENT_FAILURE, opts);
  subscription.on('message', function(msg) {
    console.log(
      'Received a message [' + msg.getSequence() + '] ' + msg.getData()
    );
    //Fire the 'registered' event:
    eventEmitter.emit('failed', JSON.parse(msg.getData()));
  });
};

module.exports = subscriptionHandler;
