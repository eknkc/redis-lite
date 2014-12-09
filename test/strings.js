var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')
  , helper = require('./helpers.js');


describe('Strings', function () {
  var c = helper.client();

  it('APPEND: should append some text to key', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , firstVal = crypto.randomBytes(4).toString('hex')
      , appendVal = crypto.randomBytes(4).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, firstVal, function (err, data) {
          assert.ok(!err);
          assert.ok(data);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        });
      },
      append: function (next) {
        c.append(key, appendVal, function (err) {
          assert.ok(!err);
          assert.ok(data, 'should return some data if succeeded');

          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, firstVal + appendVal, 'should be same if append is succeeded');

          next();
        });
      }
    }, function (err) {
      if (err) console.log(err);
      done()
    });

  })

});
