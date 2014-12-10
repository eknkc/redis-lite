var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')
  , helper = require('./helpers.js');

describe('Lists', function () {

  var c = helper.client();

  it('RPUSH: should insert some values in list', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex');

    async.series({
      check: function (next) {
        c.exists(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not exists');

          next();
        })
      },
      rpush: function (next) {
        c.rpush(key, val1, val2, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should return len of list');

          next();
        })
      },
      list: function (next) {
        c.lrange(key, 0, 100, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data[1], val2, 'should be same with val2');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('LPUSH: should prepend some values in list', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex');

    async.series({
      check: function (next) {
        c.exists(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not exists');

          next();
        })
      },
      rpush: function (next) {
        c.rpush(key, val1, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should return len of list');

          next();
        })
      },
      lpush: function (next) {
        c.lpush(key, val2, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should return len of list');

          next();
        })
      },
      list: function (next) {
        c.lrange(key, 0, 100, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data[0], val2, 'should be same with val2');

          next();
        })
      }
    }, function () {
      done();
    })
  })

});

