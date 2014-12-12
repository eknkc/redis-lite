var assert = require("assert");
var helpers = require("./helpers.js")

global.testn = 0;

describe('get / set', function () {
  this.timeout(10000);

  var c = helpers.client();

  it('should set and get a value', function (next) {
    var n = global.testn++;

    c.set('getset:' + n, "TEST MESSAGE", "PX", 100, function (err, data) {
      if (err) return next(err);
      assert.ok(data);

      c.get('getset:' + n, function (err, gdata) {
        if (err) return next(err);
        assert.equal(gdata, "TEST MESSAGE");
        next();
      });
    });
  });

  it('should set and get empty string', function (next) {
    var n = global.testn++;

    c.set('getset:' + n, "", "PX", 100, function (err, data) {
      if (err) return next(err);
      assert.ok(data);

      c.get('getset:' + n, function (err, gdata, meta) {
        if (err) return next(err);
        assert.equal(gdata, "");
        next();
      });
    });
  });

  it('should get a non existing key', function (next) {
    var n = global.testn++;

    c.get('getset:' + n, function (err, gdata) {
      if (err) return next(err);
      assert.ok(gdata === null)
      next();
    });
  });
});
