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
        c.append(key, appendVal, function (err, data) {
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

  it('APPEND: should create non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    async.series({
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null bcz key is not exist');

          next();
        })
      },
      append: function (next) {
        c.append(key, key, function (err, data) {
          assert.ok(!err);
          assert.ok(data, 'should return bits');

          next();
        })
      },
      check: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'key and value should be same if append was succeeded');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

  it('DECR: should decrese key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, 10, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      decr: function (next) {
        c.decr(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 9, 'should decrease 10 by one');

          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 9, 'should be 9 if decr succeed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  })

  it('DECR: should fail to decr string key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      decr: function (next) {
        c.decr(key, function (err, data) {
          assert.ok(err, 'should return err if val is not integer');

          next();
        })
      },
      check: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'should be same if desc failed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

  it('DECRBY: should decrese key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, 10, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      decr: function (next) {
        c.decrby(key, 2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 8, 'should decrease 10 by two');

          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 8, 'should be 8 if decr succeed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  })

  it('DECRBY: should fail to decr string key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      decr: function (next) {
        c.decrby(key, 2, function (err, data) {
          assert.ok(err, 'should return err if val is not integer');

          next();
        })
      },
      check: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'should be same if desc failed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

  it('GETRANGE: should get some ranges from key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      getRange1: function (next) {
        c.getrange(key, 0, 3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key.slice(0, 4));

          next();
        })
      },
      getRange2: function (next) {
        c.getrange(key, 2, 4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key.slice(2, 5));

          next();
        })
      },
      getRange3: function (next) {
        c.getrange(key, 3, 6, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key.slice(3, 7));

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

});
