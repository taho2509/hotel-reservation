const eventEmitter = require('./emitter');

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_CONNECTION_STRING;

var cancel = function(data) {
  console.log('Okay! lets`s cancel the reservation!');

  var reserve = {
    room: data.room,
    entry_date: data.entry_date,
    due_date: data.due_date,
    client: data.id
  };

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db('reservation');
    dbo.collection('room').deleteMany(reserve, function(err, res) {
      if (err) throw err;
      console.log(res.deletedCount + ' Reservation deleted.');
      //Fire the 'deleted' event:
      eventEmitter.emit('deleted', data);
    });
  });
};

module.exports = cancel;