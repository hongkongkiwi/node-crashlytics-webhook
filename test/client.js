var expect = require('chai').expect;
var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var request = require('request');

describe('Crashlytics Webhook Server', function() {
  var server, app, dbRecord;
  var url = 'http://localhost:' + config.get('port') + config.get('endPoint');

  var saveCrash = function(info, callback) {
    dbRecord = info;
    callback();
  }

  var route = require('../route')(config, saveCrash);

  before(function(done) {
    app = express();
    app.use(bodyParser.json());
    app.use(expressValidator());

    app.post(config.get('endPoint') || '/crash', route);

    server = app.listen(config.get('port') || 3000, function () {
      var host = server.address().address;
      var port = server.address().port;
      done();
    });
  });

  beforeEach(function (done) {
    dbRecord = {};
    done();
  });

  it('should respond to validation', function(done) {
    request({
      method: 'POST',
      url: url,
      json: true,
      form: require('./validate.json')
      }, function(err, response) {
        if (err) return done(err);
        expect(response.statusCode).to.equal(200);
        expect(dbRecord).to.be.empty;
        done();
    });
  });
  it('should respond to new issue', function(done) {
    var issueJson = require('./issue.json');
    request({
      method: 'POST',
      json: true,
      url: url,
      form: issueJson
      }, function(err, response) {
        if (err) return done(err);
        expect(response.statusCode).to.equal(200);
        expect(dbRecord).to.not.be.empty;
        expect(dbRecord).to.have.property('display_id', issueJson.display_id);
        expect(dbRecord).to.have.property('title', issueJson.title);
        expect(dbRecord).to.have.property('method', issueJson.method);
        expect(dbRecord).to.have.property('impact_level', issueJson.impact_level);
        expect(dbRecord).to.have.property('crashes_count', issueJson.crashes_count);
        expect(dbRecord).to.have.property('impacted_devices_count', issueJson.impacted_devices_count);
        expect(dbRecord).to.have.property('url', issueJson.url);
        done();
    });
  });
});
