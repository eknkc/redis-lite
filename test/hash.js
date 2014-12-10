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

  it('HGETALL: should get all fields of a key ', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.hset(key, crypto.randomBytes(8).toString('hex'), key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, '1', 'should return 1 if set ');

          next();
        })
      },
      setAnother: function (next) {
        c.hset(key, crypto.randomBytes(8).toString('hex'), key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, '1', 'should return 1 if set ');

          next();
        })
      },
      hgetall: function (next) {
        c.hgetall(key, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.ok(data.length > 0, 'should return  some fields');

          next();
        })
      }
    }, function (err, data) {
      if (err) console.log(err);
      done();
    })
  })

  it('HGETALL: should fail to get fields from non existing key ', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    c.hgetall(key, function (err, data) {
      assert.ok(!err);
      assert.equal(typeof data, 'object', 'should return obj');
      assert.equal(data.length, 0, 'should return 0');

      done();
    })

  })

  it('HDEL: should delete hash fields', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    async.series({
      set: function (next) {
        c.hset(key, key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if set');

          next()
        })
      },
      del: function (next) {
        c.hdel(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if del successfuly');

          next();
        })
      },
      get: function (next) {
        c.hget(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null if field not exist');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

  it('HDEL: should fail to delete non existing field', function (done) {

    c.hdel(crypto.randomBytes(8).toString('hex'), crypto.randomBytes(8).toString('hex'), function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if failed to del');

      done()
    })
  });

  it('HEXISTS: should return if field exists', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.hset(key, key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if set');

          next();
        });
      },
      exists: function (next) {
        c.hexists(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should retunr 1 if the hash contans field');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  });

  it('HEXISTS: should fail to return if field exits', function (done) {
    c.hexists(crypto.randomBytes(8).toString('hex'), crypto.randomBytes(8).toString('hex'), function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if couldnt find field in key');

      done();
    })
  })

});
