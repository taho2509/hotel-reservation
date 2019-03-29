'use-strict';

var express = require('express');
var router = express.Router();
const { MongoClient} = require('mongodb');
var url = process.env.MONGO_CONNECTION_STRING;

router.get('/', function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db('reservation');
    dbo
      .collection('room')
      .find()
      .toArray(function(err, result) {
        if (err) throw err;
        db.close();
        res.json(result);
      });
  });
});

router.delete('/', function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db('reservation');
    dbo.collection('room').deleteMany(function(
      err,
      result
     ) {
        if(err) {
          console.log(err);
          res.status(404); //Set status to 404 as register was not found
          res.json({ message: 'Not Found' });
       }
       db.close();
       res.json(result);
     });
  });
});

//Routes will go here
module.exports = router;
