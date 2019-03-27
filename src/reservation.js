const eventEmitter = require('./emitter');

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_CONNECTION_STRING;

let roomAvailable = (data) => new Promise((resolve, reject) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db('reservation');

    dbo.collection('room') 
      .findOne({ "$and": [ 
        {room: data.room}, 
        {"$or": [
          {"$and": [{entry_date: {"$lte": data.entry_date}}, {due_date: {"$gt": data.entry_date}}]},
          {"$and": [{entry_date: {"$lt": data.due_date}}, {due_date: {"$gte": data.due_date}}]}
        ]} 
      ]}, function(
        err,
        result
      ) {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve(result === null);
        }
      });
    
  });
});

var reservation = async function(data) {
  console.log('Hey! lets`s make a reservation!');

  var reserve = {
    room: data.room,
    entry_date: data.entry_date,
    due_date: data.due_date,
    client: data.id
  };

  let vacancy = await roomAvailable(reserve);

  if(vacancy) {
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
  } else {
    console.log('Sorry! the room is already reserved');
  }
};

module.exports = reservation;