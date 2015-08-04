module.exports = function(config, saveCrash) {

  var models = require('./models')(config),
      Crash = models.Crash;

  if (!saveCrash) {
    saveCrash = function(info, callback) {
      Crash.save({
        display_id: payload.display_id,
        title: payload.title,
        method: payload.method,
        impact_level: payload.impact_level,
        crashes_count: payload.crashes_count,
        impacted_devices_count: payload.impacted_devices_count,
        url: payload.url
      }).run().then(function(crash) {
        callback();
      }).error(callback);
    }
  }

  return function (req, res) {
    req.checkBody('event', 'Invalid postparam').notEmpty();
    req.checkBody('payload', 'Invalid postparam').notEmpty();

    req.sanitizeBody('event').toString();

    if (req.event === 'verification') {
      res.send(200);
    } else if (req.event === 'issue_impact_change') {
      var errors = req.validationErrors();
      if (errors) {
        return res.send('There have been validation errors: ' + util.inspect(errors), 400);
      }
      saveCrash({
        display_id: req.payload.display_id,
        title: req.payload.title,
        method: req.payload.method,
        impact_level: req.payload.impact_level,
        crashes_count: req.payload.crashes_count,
        impacted_devices_count: req.payload.impacted_devices_count
      }, function() {
        res.send(200);
      });
    }
  }
}
