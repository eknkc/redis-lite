var assert = require('assert')
  , async = require('async')
  , helpers = require('./helpers.js')
  , crypto = require('crypto');

describe('Keys', function () {
  this.timeout(10000);

  var c = helpers.client();

  it('DEL: should DEL existing key', function (done) {
    async.series({
      create: function (next) {
        c.set('denemeKey', "denemeVal", "EX", 100, function (err, data) {
          if (err) return next(err);
          assert.equal(data, 'OK', 'should return OK');

          next();
        });
      },
      del: function (next) {
        c.del('denemeKey', '', function (err, data) {
          if (err) return next(err);
          assert.equal(data, 1, 'should delete successfully');

          next();
        });
      },
      get: function (next) {
        c.get('denemeKey', function (err, data) {
          if (err) return next(err);
          assert.equal(data, null, 'cannot find bcz it is deleted');

          next();
        });
      }
    }, function (err, data) {
      if (err) console.log(err);
      done();
    })
  });

  it('DEL: should fail to DEL not existing key', function (done) {

    async.series({
      del: function (next) {
        c.del('aganiginaganigi', '', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 when failed to DEL key');

          next()
        })
      },
      checkIfExist: function (next) {
        c.get('aganiginaganigi', function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null bcz key is not exist');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })
  });

  it('EXISTS: should return 1 if key EXISTS', function (done) {

    async.series({
      set: function (next) {
        c.set('hede', 'hodo', 'EX', 100, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK');

          next();
        })
      },
      exists: function (next) {
        c.exists('hede', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if exists');

          next();
        })
      },
      check: function (next) {
        c.get('hede', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'hodo', 'should return val of key');

          next();
        })
      }
    }, function (err, data) {
      if (err) return done(err);
      done();
    })
  });

  it('EXISTS: should return 0 if key not EXISTS', function (done) {

    async.series({
      exists: function (next) {
        c.exists('hedehodo', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not exists')

          next();
        });
      },
      check: function (next) {
        c.get('hedehodo', function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null if couldnt found');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  });

  it('EXPIRE: should set ttl for key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpire: function (next) {
        c.expire(key, 2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if timeout is set');

          next();
        })
      },
      checkTtl: function (next) {
        c.ttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > -1, 'should be still alive');

          next();
        })
      },
      checkTtlAgain: function (next) {
        setTimeout(function () {
          c.ttl(key, function (err, data) {
            assert.ok(!err);
            assert.equal(data, -2, 'should return -2 if it is expired');

            next();
          })
        }, 2000)
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })

  });

  it('EXPIRE: should fail to set ttl for not existing key', function (done) {

    c.expire(crypto.randomBytes(5).toString('hex'), 10, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if key does not exists');

      done();
    })

  });

  it('EXPIREAT: should set ttl unix timestamp for key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpireat: function (next) {
        var expTimestamp = Math.round(new Date / 1000) + 2;

        c.expireat(key, expTimestamp, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if timeout is set');

          next();
        })
      },
      checkTtl: function (next) {
        c.exists(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if it is still alive');

          next();
        })
      },
      checkTtlAgain: function (next) {
        setTimeout(function () {
          c.exists(key, function (err, data) {
            assert.ok(!err);
            assert.equal(data, 0, 'should return 0 if it is expired');

            next();
          })
        }, 4000)
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })

  });

  it('EXPIREAT: should fail to set ttl unix timestamp for not existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , expTimestamp = Math.round(new Date / 1000) + 2;

    c.expireat(key, expTimestamp, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 key is not exists');

      done();
    })
  });

  it('EXPIREAT: should fail to set ttl with invalid unix timestamp for key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpireat: function (next) {
        var expTimestamp = key;

        c.expireat(key, expTimestamp, function (err, data) {
          assert.ok(err, 'should return error when timestamp is not valid');

          next();
        })
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })

  });

  it('MOVE: should move key from (0) to another db (1)', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if key was successfully created');

          next();
        });
      },
      move: function (next) {
        c.move(key, '1', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if key is moved successfully');

          next();
        });
      },
      get: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null if key couldnt found in db 0');

          next();
        });
      },
      changeDb: function (next) {
        c.select(1, function (err, data) {
          assert.ok(!err);

          next();
        });
      },
      getFromDb: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(key, data, 'should be found in new db');

          next();
        })
      }
    }, function (err, data) {
      if (err) return done(err);
      done();
    })

  });

  it('MOVE: should fail to move key', function (done) {
    c.move(crypto.randomBytes(8).toString('hex'), 5, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if key is not moved successfully');

      done();
    });
  });

  it('PERSIST: should remove ttl of key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, 'EX', 10, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should succesfuly set key');

          done();
        });
      },
      checkTll: function (next) {
        c.ttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should still alive');

          done();
        })
      },
      persist: function (next) {
        c.persist(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if ttl is removed');

          done();
        })
      },
      checkTtlAgain: function (next) {
        c.ttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should still alive');

          done();
        })
      }
    }, function (err, data) {
      done(err);
    })
  });

  it('PERSIST: should fail to remove non existing key', function (done) {

    c.persist(crypto.randomBytes(8).toString('hex'), function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if key not exists');

      done();
    })
  });

  it('PEXPIRE: should set ttl for key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpire: function (next) {
        c.pexpire(key, 1000, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if timeout is set');

          next();
        })
      },
      checkTtl: function (next) {
        c.pttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > -1, 'should be still alive');

          next();
        })
      },
      checkTtlAgain: function (next) {
        setTimeout(function () {
          c.pttl(key, function (err, data) {
            assert.ok(!err);
            assert.equal(data, -2, 'should return -2 if it is expired');

            next();
          })
        }, 2000)
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })

  });

  it('PEXPIRE: should fail to set ttl for not existing key', function (done) {

    c.pexpire(crypto.randomBytes(5).toString('hex'), 10, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if key does not exists');

      done();
    })

  });

  it('PEXPIREAT: should set ttl unix timestamp for key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpireat: function (next) {
        var expTimestamp = Math.round(new Date / 1) + 2000;

        c.pexpireat(key, expTimestamp, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if timeout is set');

          next();
        })
      },
      checkTtl: function (next) {
        c.exists(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if it is still alive');

          next();
        })
      },
      checkTtlAgain: function (next) {
        setTimeout(function () {
          c.exists(key, function (err, data) {
            assert.ok(!err);
            assert.equal(data, 0, 'should return 0 if it is expired');

            next();
          })
        }, 4000)
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })

  });

  it('PEXPIREAT: should fail to set ttl unix timestamp for not existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , expTimestamp = Math.round(new Date / 1000) + 2;

    c.expireat(key, expTimestamp, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 key is not exists');

      done();
    })
  });

  it('PEXPIREAT: should fail to set ttl with invalid unix timestamp for key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpireat: function (next) {
        var expTimestamp = key;

        c.pexpireat(key, expTimestamp, function (err, data) {
          assert.ok(err, 'should return error when timestamp is not valid');

          next();
        })
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })

  });

  it('PTTL: should show remaining ttl', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpire: function (next) {
        c.pexpire(key, 1000, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if timeout is set');

          next();
        })
      },
      checkTtl: function (next) {
        c.pttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > -1, 'should be still alive');

          next();
        })
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })


  })

  it('PTTL: should fail to get remaining ttl of non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.pttl(key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, -2, 'should return -2 if key is not exist');

      done();
    })
  });

  it('RANDOMKEY: should return random key', function (done) {

    c.randomkey(function (err, data) {
      assert.ok(!err);
      assert.ok(data, 'should return some key');

      done();
    })
  })

  it('RENAME: should rename key to new key', function (done) {
    var key1 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key1, key1, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if key is successfuly created');

          next();
        })
      },
      rename: function (next) {
        c.rename(key1, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if key is successfully renamed');

          done();
        })
      },
      checkKey1: function (next) {
        c.get(key1, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should return null if key is not found');

          done();
        })
      },
      checkKey2: function (next) {
        c.get(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, key1, 'should have same value with key1');

          done();
        })
      }
    })

  })

  it('RENAME: should fail to rename non existing key', function (done) {

    c.rename('{deneme}' + crypto.randomBytes(8).toString('hex'), '{deneme}' + crypto.randomBytes(8).toString('hex'), function (err, data) {
      assert.ok(err, 'should return error if key is not exists');

      done();
    })
  });

  it('RENAME: should fail to rename keys from different server', function (done) {
    var k = crypto.randomBytes(8).toString('hex')
      , k2 = crypto.randomBytes(8).toString('hex');

    async.series({
      set1: function (next) {
        c.set(k, k, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      set2: function (next) {
        c.set(k2, k2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      tryRename: function (next) {
        c.rename(crypto.randomBytes(8).toString('hex'), crypto.randomBytes(8).toString('hex'), function (err, data) {
          assert.ok(err, 'should return error if key is not exists');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    });


  });

  it('RENAMENX: should rename a key only if the new key does not exist and on the same hash slots', function (done) {
    var key = '{hash}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{hash}' + crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next()
        })
      },
      renamenx: function (next) {
        c.renamenx(key, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, '1', 'should return 1 if key was renamed to newkey');

          next();
        })
      }
    }, function (err) {
      if (err) console.log(err);
      done();
    })

  })

  it('RENAMENX: should fail to rename a key to existing key', function (done) {
    var key = '{deneme}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme}' + crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      setNew: function (next) {
        c.set(key2, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK if set');

          next();
        })
      },
      renamenx: function (next) {
        c.renamenx(key, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, '0', 'should return 0 if newkey exists');

          next();
        })
      },
      check: function (next) {
        c.get(key2, function (err, data) {
          assert.ok(!err);
          assert.notEqual(data, key, 'should be different if keys wasnt changed');

          next();
        })
      }
    }, function () {
      done();
    })

  });

  it('TTL: should show remaining ttl', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.set(key, key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should set key');

          next();
        })
      },
      setExpire: function (next) {
        c.expire(key, 1000, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if timeout is set');

          next();
        })
      },
      checkTtl: function (next) {
        c.ttl(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data > -1, 'should be still alive');

          next();
        })
      }
    }, function (err) {
      if (err) return done(err);
      done();
    })


  })

  it('TTL: should fail to get remaining ttl of non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.ttl(key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, -2, 'should return -2 if key is not exist');

      done();
    })
  });
})
