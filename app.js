var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var route = require('./route')(config);

var app = express();
app.use(bodyParser.json());
app.use(expressValidator());

app.get(config.get('endPoint') || '/crash', route);

var server = app.listen(config.get('port') || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Crashlytics Webhook listening at http://%s:%s', host, port);
});
