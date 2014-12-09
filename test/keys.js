var assert = require('assert')
  , async = require('async')
  , helpers = require('./helpers.js')
  , crypto = require('crypto');


describe('Keys', function () {
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
      if (err) return console.log(err);
      done();
    })
  });

  it('DEL: should fail to DEL not existing key', function (done) {

    c.del('aganiginaganigi', '', function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 when failed to DEL key');

      done()
    });
  });

  it('EXISTS: should return 1 if key EXISTS', function (done) {

    async.series({
      set: function (next) {
        c.set('hede', 'hodo', 'EX', 100, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'OK', 'should return OK');

          next();
        })
      }, exists: function (next) {
        c.exists('hede', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if exists');

          next();
        })
      }
    }, function (err, data) {
      if (err) return done(err);
      done();
    })
  });

  it('EXISTS: should return 0 if key not EXISTS', function (done) {
    c.exists('hedehodo', function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if not exists')

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
          assert.equal(data, 'OK', 'should return OK if db changed');

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

  //it('DUMP', function (done) {
  //  var val = 'hodo';
  //
  //  async.auto({
  //    set: function (next) {
  //      c.set('hede', val, 'EX', 1000, function (err, data) {
  //        if (err) return next(err);
  //        assert.ok(data);
  //
  //        next();
  //      })
  //    },
  //    dump: ['set', function (next) {
  //      c.dump('hede', function (err, data) {
  //        if (err) return next(err);
  //        assert.ok(data, 'should dump existing key');
  //
  //        console.log(data);
  //
  //        next();
  //      })
  //    }],
  //    restore: ['dump', function (next, data) {
  //      c.restore('hede', '0', 'asdsa', function (err, data) {
  //        if (err) return next(err);
  //        assert.equal(data, val, 'hash should be restored successfully');
  //
  //        next();
  //      })
  //    }]
  //  }, function (err, data) {
  //    console.log(data);
  //    if (err) return done(err);
  //
  //    done();
  //  })
  //
  //})

});
