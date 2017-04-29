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
  neo_reference_id: Number,
  name: String,
  nasa_jpl_url: String,
  estimated_diameter_max: Number,
  relative_velocity: Number,
  close_approach_date: String,
  miss_distance: Number,
});

var Neo = mongoose.model('Neo', neoSchema);

var selectAll = function(callback) {
  Neo.find({}, function(err, items) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

module.exports.Neo = Neo;
module.exports.selectAll = selectAll;