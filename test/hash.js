var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')
  , helper = require('./helpers.js');

describe('Hashes', function () {
  var c = helper.client();

  it('HSET: should set', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.hset(key, key, key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 1, 'should return 1 if set');

      done();
    })
  });

  it('HSET: should fail to set existing field', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      hset: function (next) {
        c.hset(key, key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if set');

          done();
        })
      },
      hsetAgain: function (next) {
        c.hset(key, key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if set');

          done();
        })
      }
    })
  });

  it('HGET: should get key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      hset: function (next) {
        c.hset(key, key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if set');

          next();
        })
      },
      hget: function (next) {
        c.hget(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'should be same if set');

          next();
        });
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

  it('HGET: should fail to get non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.hget(key, key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, null, 'should return null if key not found');

      done();
    })

  })
});
