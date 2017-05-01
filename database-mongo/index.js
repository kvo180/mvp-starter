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
  neoId: {type: Number, unique: true, dropDups: true},
  name: String,
  url: String,
  diameter: Number,
  velocity: Number,
  approachDate: String,
  missDistance: Number,
  hazardous: Boolean
});

var Neo = mongoose.model('Neo', neoSchema);

var selectAllNeos = function(callback) {
  Neo.find({}).sort('-approachDate')
  .then((neos) => {
    callback(null, neos);
  })
  .catch((err) => {
    callback(err, null);
  });
};

var photoSchema = mongoose.Schema({
  id: {type: Number, unique: true, dropDups: true},
  cameraName: String,
  cameraFullName: String,
  src: String,
  date: String
});

var Photo = mongoose.model('Photo', photoSchema);

var selectAllPhotos = function(callback) {
  Photo.find({}).sort('-earthDate')
  .then((neos) => {
    callback(null, neos);
  })
  .catch((err) => {
    callback(err, null);
  });
};

module.exports.Neo = Neo;
module.exports.selectAllNeos = selectAllNeos;
module.exports.Photo = Photo;
module.exports.selectAllPhotos = selectAllPhotos;