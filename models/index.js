module.exports = function(config) {
  var thinky = require('thinky')(config.get('db'));
  var type = thinky.type;

  var Crash = thinky.createModel("Crash", {
      display_id: type.number(),
      title: type.string(),
      method: type.string(),
      impact_level: type.number(),
      crashes_count: type.number(),
      impacted_devices_count: type.number(),
      url: type.string(),
  });

  return {
    Crash: Crash
  }
}
