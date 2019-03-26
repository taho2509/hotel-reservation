const stan = require('./stan');

var prices = [
  {'room_number': 101, 'price_night': 5},
  {'room_number': 102, 'price_night': 6},
  {'room_number': 103, 'price_night': 7},
  {'room_number': 104, 'price_night': 8},
  {'room_number': 201, 'price_night': 9},
  {'room_number': 202, 'price_night': 10},
  {'room_number': 203, 'price_night': 11},
  {'room_number': 204, 'price_night': 12},
  {'room_number': 301, 'price_night': 13},
  {'room_number': 302, 'price_night': 14},
  {'room_number': 303, 'price_night': 15},
  {'room_number': 304, 'price_night': 16},
  {'room_number': 401, 'price_night': 17},
  {'room_number': 402, 'price_night': 18},
  {'room_number': 403, 'price_night': 19},
  {'room_number': 404, 'price_night': 20},
];

var getTotalDays = (initial, final) => (new Date(final) - new Date(initial))/1000/86400;

var publisher = function(data) {

  let room = prices.find((element) => element.room_number == data.room);
  if(room == undefined) {
    console.log('room not found');
    return;
  }

  let price = room.price_night * getTotalDays(data.entry_date,data.due_date);

  stan.publish(
    process.env.QUEUE_EVENT_TO_PUBLISH,
    JSON.stringify({ 'id': data.id, 'price': price, 'room': data.room }),
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