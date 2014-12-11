var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')
  , helper = require('./helpers.js');


describe('Sets', function () {
  var c = helper.client();

  it('SADD: should add some members in a set ', function (done) {
    var key = crypto.randomBytes(4).toString('hex');

    async.series({
      sadd: function (next) {
        c.sadd(key, crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as length of insert');

          next();
        })
      },
      smembers: function (next) {
        c.smembers(key, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof  data, 'object', 'should return obj');
          assert.equal(data.length, 3, 'should return 3 as length of set');

          next();
        })
      }
    }, function () {
      done();
    })
  })

});
