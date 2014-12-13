var helper = require('./helpers.js');
var assert = require('assert');
var async = require("async");

describe('Script', function () {
  var c = helper.client();

  it.only("SCRIPT: should compile and eval a lua script", function (next) {
    var s = c.createScript('redis.call("SET", KEYS[1], ARGV[1])\nreturn redis.call("GET", KEYS[1])');

    async.times(10, function(i, next) {
      s.eval(["key" + i], ["value" + i], function (err, data) {
        if (err) return next(err);
        assert.equal(data, "value" + i);
        next();
      });
    }, next);
  })
});
