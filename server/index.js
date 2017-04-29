var express = require('express');
var bodyParser = require('body-parser');
var bluebird = require('bluebird');
var request = require('request-promise');
var apiKey = require('./config/nasa.js');
var db = require('../database-mongo/index.js');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());

app.get('/neos', function (req, res) {
  db.selectAll(function(err, data) {
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
        addNeosToDatabase(neosArray, () => {
          res.end();
        });
      });
    }
  })
  .catch((err) => {
    res.sendStatus(404);
  });
});

var addNeosToDatabase = (neosArray, callback) => {
  neosArray.forEach((neo) => {
    var neoObj = {
      neoId: parseInt(neo.neo_reference_id),
      name: neo.name,
      url: neo.nasa_jpl_url,
      diameter: parseFloat(neo.estimated_diameter.miles.estimated_diameter_max),
      velocity: parseFloat(neo.close_approach_data[0].relative_velocity.miles_per_hour),
      approachDate: neo.close_approach_data[0].close_approach_date,
      missDistance: parseInt(neo.close_approach_data[0].miss_distance.miles),
      hazardous: neo.is_potentially_hazardous_asteroid
    }

    var neoModel = new db.Neo(neoObj);
    neoModel.save()
    .then(() => {
      console.log('saved to database');
    })
    .catch((err) => {
      return console.error(err);
    });
  });

  callback();
};

var parseNeosData = (data, callback) => {
  var allData = [];
  for (var key in data) {
    allData = allData.concat(data[key]);
  }

  callback(allData);
};

app.listen(1983, function() {
  console.log('listening on port 1983!');
});

