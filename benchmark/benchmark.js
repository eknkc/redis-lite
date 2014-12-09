var c = require("../index")(["localhost", "localhost:6479"], { connectionsPerServer: 1 });

suite('basic', function() {
  before(function (next) {
    c.set('gettest1', "VALUE", "PX", 1000, next);
  });

  set('concurrency', 50);
  //set('iterations', 100000)

  bench('get', function (next) {
    c.get('gettest1', next);
  });

  bench('set', function (next) {
    c.set('settest1', "VALUE", "PX", 100, next);
  });

  bench('eval', function (next) {
    c.eval('redis.call("set", KEYS[1], "test"); return redis.call("get", KEYS[1])', 1, "{e}key", next);
  })
});
