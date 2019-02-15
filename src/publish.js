const stan = require('./stan');

var publisher = function(data) {
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

module.exports = publisher;