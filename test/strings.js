var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')
  , helper = require('./helpers.js');

describe('Strings', function () {
  this.timeout(10000);

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

  it('GETSET: should set if not existed', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    async.series({
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should be null if key is not exist');

          next();
        })
      },
      getset: function (next) {
        c.getset(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null if key is not set previosly');

          next();
        })
      },
      getsetagain: function (next) {
        c.getset(key, 'changed', function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'key and val should be same if getset not worked');

          next();
        })
      }

    }, function (err) {
      if (err) console.log(err);
      done();
    })
  })

  it('INCR: should increase key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, 10, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      incr: function (next) {
        c.incr(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 11, 'should increase 10 by one');

          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 11, 'should be 11 if incr succeed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  })

  it('INCR: should fail to incr string key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      incr: function (next) {
        c.incr(key, function (err, data) {
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

  it('INCRBY: should inc key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, 10, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      incr: function (next) {
        c.incrby(key, 2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 12, 'should increased 10 by two');

          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 12, 'should be 12 if incrby succeed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  })

  it('INCRBY: should fail to incr string key', function (done) {
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
        c.incrbyfloat(key, 2, function (err, data) {
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

  it('INCRBYFLOAT: should inc key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, 10.0, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      incr: function (next) {
        c.incrbyfloat(key, 2.2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 12.2, 'should increased 10 by 2.2');

          next();
        })
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 12.2, 'should be 12.2 if incrby succeed');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  })

  it('INCRBYFLOAT: should fail to incr string key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      incr: function (next) {
        c.incrbyfloat(key, 2.0, function (err, data) {
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

  it('PSETEX: should set ttl in milliseconds', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      psetex: function (next) {
        c.psetex(key, 2000, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      checkttl: function (next) {
        c.pttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should still alive');

          next();
        })
      },
      waitUnitlExpired: function (next) {
        setTimeout(function () {
          c.pttl(key, function (err, data) {
            assert.ok(!err);
            assert.equal(data, -2, 'key should expired');

            next();
          })
        }, 2500)
      }
    }, function (err) {
      if (err)console.log(err);
      done();
    })
  })

  it('SETEX: should set ttl in seconds', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      setex: function (next) {
        c.setex(key, 2, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      checkttl: function (next) {
        c.ttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should still alive');

          next();
        })
      },
      waitUnitlExpired: function (next) {
        setTimeout(function () {
          c.ttl(key, function (err, data) {
            assert.ok(!err);
            assert.equal(data, -2, 'key should expired');

            next();
          })
        }, 2500)
      }

    }, function (err) {
      if (err)console.log(err);
      done();
    })
  })

  it('SETNX: should set a key if key does not exist ', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should be null bcz key is not set');

          next();
        })
      },
      setnx: function (next) {
        c.setnx(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if set key');

          next();
        })
      },
      getagain: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'key and val should be same if setnx worked');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done()
    })
  })

  it('SETNX: should fail set a key if key bcz key exist', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should be OK if set');

          next();
        })
      },
      setnx: function (next) {
        c.setnx(key, 'deneme', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if couldnt set key');

          next();
        })
      },
      getagain: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key, 'key and val should be same if setnx didnt worked');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done()
    })
  })
});
