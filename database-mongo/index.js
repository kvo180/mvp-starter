var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var neoSchema = mongoose.Schema({
  neoId: {type: Number, unique: true},
  name: String,
  url: String,
  diameter: Number,
  velocity: Number,
  approachDate: String,
  missDistance: Number,
  hazardous: Boolean
});

var Neo = mongoose.model('Neo', neoSchema);

var selectAll = function(callback) {
  Neo.find({}).sort('-approachDate')
  .then((neos) => {
    callback(null, neos);
  })
  .catch((err) => {
    callback(err, null);
  });
};

module.exports.Neo = Neo;
module.exports.selectAll = selectAll;