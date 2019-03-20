const eventEmitter = require('./emitter');

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_CONNECTION_STRING;

var reservation = function(data) {
  console.log('Hey! lets`s make a reservation!');

  var reserve = {
    room: data.room,
    entry_date: data.entry_date,
    due_date: data.due_date,
    client: data.id
  };

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
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

module.exports = reservation;