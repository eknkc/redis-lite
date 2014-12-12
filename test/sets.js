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

  it('SCARD: should return lenght of sets', function (done) {
    var key = crypto.randomBytes(4).toString('hex');

    async.series({

      sadd: function (next) {
        c.sadd(key, crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as length of sets');

          next();
        })
      },
      scard1: function (next) {
        c.scard(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as length of set');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key, crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as length of sets');

          next();
        })
      },
      scard2: function (next) {
        c.scard(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as length of set');

          next();
        })
      }
    }, function () {
      done();
    })

  })

  it('SCARD: should return 0 if key is not exist', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    c.scard(key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 key is not exist');

      done();
    })
  })

  it('SDIFF: should return differences between keys', function (done) {
    var key1 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as len of key');

          next();
        })
      },
      sdiff: function (next) {
        c.sdiff(key1, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', ' should retun obj');
          assert.equal(data[0], val4, 'should return val4 as diff');

          next();
        })
      }
    }, function () {
      done();
    })

  });

  it('SDIFF: should fail to return differences between keys from different hash ranges', function (done) {
    var key1 = '{aganiginaganigi}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as len of key');

          next();
        })
      },
      sdiff: function (next) {
        c.sdiff(key1, key2, function (err, data) {
          assert.ok(err);

          next();
        })
      }
    }, function () {
      done();
    })

  })

  it('SDIFFSTORE: should return differences between keys and store to new key', function (done) {
    var key1 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key3 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as len of key');

          next();
        })
      },
      sdiff: function (next) {
        c.sdiffstore(key3, key1, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 as diff');

          next();
        })
      },
      smembers: function (next) {
        c.smembers(key3, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj of sets');
          assert.equal(data[0], val4, 'set should be consisted only of val4')

          next();
        })
      }
    }, function () {
      done();
    })

  });

  it('SDIFFSTORE: should fail to return differences between keys from different hash ranges', function (done) {
    var key1 = '{aganiginaganigi}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key3 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as len of key');

          next();
        })
      },
      sdiffstore: function (next) {
        c.sdiff(key3, key1, key2, function (err, data) {
          assert.ok(err);

          next();
        })
      }
    }, function () {
      done();
    })

  })

  it('SINTER: should return intersection between keys', function (done) {
    var key1 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as len of key');

          next();
        })
      },
      sinter: function (next) {
        c.sinter(key1, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', ' should return obj');
          assert.ok(data.indexOf(val1) > -1, 'should return val1 as diff');
          assert.ok(data.indexOf(val2) > -1, 'should return val1 as diff');

          next();
        })
      }
    }, function () {
      done();
    })

  });

  it('SINTER: should fail to return intersection between keys from different hash ranges', function (done) {
    var key1 = '{aganiginaganigi}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as len of key');

          next();
        })
      },
      sdiff: function (next) {
        c.sinter(key1, key2, function (err, data) {
          assert.ok(err);

          next();
        })
      }
    }, function () {
      done();
    })

  })

  it('SINTERSTORE: should return intersection between keys and store to new key', function (done) {
    var key1 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key3 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 3 as len of key');

          next();
        })
      },
      sinterstore: function (next) {
        c.sinterstore(key3, key1, key2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 if ok');

          next();
        })
      },
      smembers: function (next) {
        c.smembers(key3, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj of sets');
          assert.ok(data.indexOf(val1) > -1, 'should return val1 as diff');
          assert.ok(data.indexOf(val2) > -1, 'should return val1 as diff');

          next();
        })
      }
    }, function () {
      done();
    })

  });

  it('SINTERSTORE: should fail to return intersection between keys from different hash ranges', function (done) {
    var key1 = '{aganiginaganigi}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key3 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex')
      , val4 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd1: function (next) {
        c.sadd(key1, val1, val2, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 4, 'should return 4 as len of key');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as len of key');

          next();
        })
      },
      sinterstore: function (next) {
        c.sinterstore(key3, key1, key2, function (err, data) {
          assert.ok(err);

          next();
        })
      }
    }, function () {
      done();
    })

  })

  it('SISMEMBER: should return if a given member is a member of the set stored at key', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , mem1 = crypto.randomBytes(8).toString('hex')
      , mem2 = crypto.randomBytes(8).toString('hex')
      , mem3 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd: function (next) {
        c.sadd(key, mem1, mem2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 2, 'should return 2 as length of insert');

          next();
        })
      },
      smembers1: function (next) {
        c.sismember(key, mem1, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if is a member of a set');

          next();
        })
      },
      smembers2: function (next) {
        c.sismember(key, mem2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if is a member of a set');

          next();
        })
      },
      smembers3: function (next) {
        c.sismember(key, mem3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if is not a member of a set');

          next();
        })
      }
    }, function () {
      done();
    })
  });

  it('SISMEMBER: should return 0 if key is not exist', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    c.sismember(key, key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if key is not exist');

      done();
    })
  });

  it('SMEMBERS: should add some members in a set ', function (done) {
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

  it('SMEMBERS: should return empty list if key is not exist', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.smembers(key, function (err, data) {
      assert.ok(!err);
      assert.equal(typeof data, 'object', 'should retun empty');
      assert.equal(data.length, 0, 'should return 0 as set lenght');

      done();
    })
  })

  it('SMOVE: should move member from one set to another', function (done) {
    var key1 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{deneme123}' + crypto.randomBytes(8).toString('hex')
      , m1 = crypto.randomBytes(8).toString('hex')
      , m2 = crypto.randomBytes(8).toString('hex')
      , m3 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd: function (next) {
        c.sadd(key1, m1, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, m2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1');

          next();
        })
      },
      smove: function (next) {
        c.smove(key1, key2, m1, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if moved');

          next();
        });
      },
      smembers1: function (next) {
        c.smembers(key1, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.length, 0, 'should be 0 if moved');

          next();
        })
      },
      smembers2: function (next) {
        c.smembers(key2, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.length, 2, 'should be 0 if moved');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('SMOVE: should fail to move member from one set to another from different hash set', function (done) {
    var key1 = '{a}' + crypto.randomBytes(8).toString('hex')
      , key2 = '{dbasdasd}' + crypto.randomBytes(8).toString('hex')
      , m1 = crypto.randomBytes(8).toString('hex')
      , m2 = crypto.randomBytes(8).toString('hex')
      , m3 = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd: function (next) {
        c.sadd(key1, m1, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1');

          next();
        })
      },
      sadd2: function (next) {
        c.sadd(key2, m2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1');

          next();
        })
      },
      smove: function (next) {
        c.smove(key1, key2, m1, function (err, data) {
          assert.ok(err);

          next();
        });
      }
    }, function () {
      done();
    })
  });

  it('SPOP: should add some members in a set ', function (done) {
    var key = crypto.randomBytes(4).toString('hex')
      , removed;

    async.series({
      sadd: function (next) {
        c.sadd(key, crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as length of insert');

          next();
        })
      },
      spop: function (next) {
        c.spop(key, function (err, data) {
          assert.ok(!err);
          assert.ok(data, 'should return removed element');
          removed = data;
          next();
        })
      },
      smembers: function (next) {
        c.smembers(key, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return object');
          assert.equal(data.indexOf(removed), -1, 'should return -1 if removed');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('SPOP: should fail to remove element from non existing key', function (done) {

    var key = crypto.randomBytes(8).toString('hex');
    c.spop(key, key, function (err, data) {
      assert.ok(err);

      done();
    })
  })

  it('SRANDMEMBER: should get random key from set', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      sadd: function (next) {
        c.sadd(key, crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), crypto.randomBytes(4).toString('hex'), function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as length of set');

          next();
        })
      },
      srandmember: function (next) {
        c.srandmember(key, 1, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.length, 1, 'should return 1 as length');

          next();
        })
      },
      srandmember2: function (next) {
        c.srandmember(key, 3, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.length, 3, 'should return 1 as length');

          next();
        })
      },
    }, function () {
      done();
    })
  })

  it('SRANDMEMBER: should return empty list if key is not exist', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.srandmember(key, 9, function (err, data) {
      assert.ok(!err);
      assert.equal(typeof data, 'object', 'should return empty obj');
      assert.equal(data.length, '0', 'should return 0 length');

      done();
    })
  });

  it('SREM: should remove specified member from set', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(4).toString('hex')
      , val2 = crypto.randomBytes(4).toString('hex')
      , val3 = crypto.randomBytes(4).toString('hex')
      , val4 = crypto.randomBytes(4).toString('hex');

    async.series({
      add: function (next) {
        c.sadd(key, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as length of insert');

          next();
        })
      },
      srem: function (next) {
        c.srem(key, val3, val4, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if removed');

          next();
        })
      },
      check: function (next) {
        c.smembers(key, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.indexOf(val3), -1, 'should return -1 if removed');
          assert.equal(data.indexOf(val4), -1, 'should return -1 if removed');

          next()
        })
      },
      srem2: function (next) {
        c.srem(key, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 1, 'should return 1 if removed');

          next();
        })
      },
      check2: function (next) {
        c.smembers(key, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.indexOf(val2), -1, 'should return -1 if removed');

          next()
        })
      }
    }, function () {
      done();
    })
  })

  it('SREM: should return 0 if key or member not exist', function (done) {
    var key = crypto.randomBytes(4).toString('hex');

    c.srem(key, crypto.randomBytes(8).toString('hex'), function (err, data) {
      assert.ok(!err);
      assert.equal(data, 0, 'should return 0 if key or member not exist');

      done();
    })
  })


});
