var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database-mongo');
var bluebird = require('bluebird');
var request = require('request-promise');
var apiKey = require('./config/nasa.js');
var db = require('../database-mongo/index.js');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());

app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.post('/neos/import', function(req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var key = apiKey();

  var options = {
    url: `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${key}`,
    method: 'GET',
    json: true
  }

  request(options)
  .then((data) => {
    if (data.near_earth_objects) {
      var neos = data.near_earth_objects;

      parseNeosData(neos, (neosArray) => {
        res.end(JSON.stringify(neosArray));
      });
    }
  })
  .catch((err) => {
    res.sendStatus(404);
  });
});

var addNeosToDatabase = (neosArray, callback) => {

};

var parseNeosData = (data, callback) => {
  var allData = [];
  for (var key in data) {
    allData = allData.concat(data[key]);
  }
  console.log(typeof allData[0].close_approach_data[0].relative_velocity.miles_per_hour)
  callback(allData);
};

app.listen(1983, function() {
  console.log('listening on port 1983!');
});

