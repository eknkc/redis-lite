var assert = require("assert")
  , async = require('async')
  , helpers = require("./helpers.js");


describe('APPEND', function () {
  var c = helpers.client();

  it('should APPEND some text', function (done) {
    var key = 'deneme', firstVal = 'onedio', appendVal = 'bunedio';

    async.series({
      set: function (next) {
        c.set(key, firstVal, "EX", 100, function (err, data) {
          if (err) return next(err);
          assert.ok(data);
          next();
        });
      },
      append: function (next) {
        c.append(key, appendVal, function (err) {
          if (err) return next(err);
          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          if (err) return next(err);
          assert.equal(firstVal + appendVal, data);
          next();
        });
      }
    }, function (err) {
      if (err) return next(err);
      done()
    });

  });
});

