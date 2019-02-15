'use-strict';

var events = require('events');
var eventEmitter = new events.EventEmitter();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_CONNECTION_STRING;

const clientId = `client_${new Date().getTime()}`;
const clusterName = process.env.QUEUE_CLUSTER_NAME;

var stan = require('node-nats-streaming').connect(clusterName, clientId);

stan.on('connect', function() {
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
});

var registrationHandler = function(data) {
  console.log('Hey! lets`s make a reservation!');

  var reserve = {
    room: data.room,
    entry_date: data.entry_date,
    due_date: data.due_date,
    client: data.id
  };

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('reservation');
    dbo.collection('room').insertOne(reserve, function(err, res) {
      if (err) throw err;
      console.log(res.insertedCount + ' Reservation inserted.');
      //Fire the 'saved' event:
      eventEmitter.emit('saved', data);
    });
  });
};

//Assign the event handler to an event:
eventEmitter.on('registered', registrationHandler);

var publishHandler = function(data) {
  stan.publish(
    process.env.QUEUE_EVENT_TO_PUBLISH,
    JSON.stringify({ price: 120 }), //TODO: compute real price
    function(err, guid) {
      if (err) {
        console.log('publish failed: ' + err);
      } else {
        console.log('published message with guid: ' + guid);
      }
    }
  );
};

eventEmitter.on('saved', publishHandler);
