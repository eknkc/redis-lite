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

  it('RPUSHX: should insert value in list if key exits', function (done) {
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
      rpushx: function (next) {
        c.rpushx(key, val2, function (err, data) {
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

  it('RPUSHX: should fail to insert value in list if key is not exit', function (done) {
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
      rpushx: function (next) {
        c.rpushx(key, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not st');

          next();
        })
      },
      list: function (next) {
        c.lrange(key, 0, 100, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.length, 0, 'should return 0 as array lenght');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('LPUSHX: should insert value in list if key exits', function (done) {
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
      rpushx: function (next) {
        c.lpushx(key, val2, function (err, data) {
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

  it('LPUSHX: should fail to insert value in list if key is not exit', function (done) {
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
      rpushx: function (next) {
        c.lpushx(key, val2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not st');

          next();
        })
      },
      list: function (next) {
        c.lrange(key, 0, 100, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data.length, 0, 'should return 0 as array lenght');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('RPOP: should remove the last element in list', function (done) {
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
      rpop: function (next) {
        c.rpop(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, val2, 'should return deleted');

          next();
        })
      },
      list: function (next) {
        c.lrange(key, 0, 100, function (err, data) {
          assert.ok(!err);
          assert.equal(typeof data, 'object', 'should return obj');
          assert.equal(data[0], val1, 'should be same with val1');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('RPOP: should fail to remove val from non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.rpop(key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, null, 'should return null if key non exist')

      done();
    })

  })

  it('LPOP: should remove the first element in list', function (done) {
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
      lpush: function (next) {
        c.rpush(key, val1, val2, function (err, data) {
          assert.ok(!err);
          assert.ok(data > 0, 'should return len of list');

          next();
        })
      },
      lpop: function (next) {
        c.lpop(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, val1, 'should return deleted');

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

  it('LPOP: should fail to remove val from non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');
    c.lpop(key, function (err, data) {
      assert.ok(!err);
      assert.equal(data, null, 'should return null if key non exist')

      done();
    })

  })

  it('LINDEX: should return val by index', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.rpush(key, 'test1', 'test2', 'test3', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return number of inserted values');

          next();
        })
      },
      index0: function (next) {
        c.lindex(key, 0, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'test1', 'should be test1');

          next();
        })
      },
      index2: function (next) {
        c.lindex(key, 2, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'test3', 'should be test3');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('LINDEX: should retun null if checking non existing index', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      set: function (next) {
        c.rpush(key, 'test1', 'test2', 'test3', function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return number of inserted values');

          next();
        })
      },
      index0: function (next) {
        c.lindex(key, 0, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 'test1', 'should be test1');

          next();
        })
      },
      index2: function (next) {
        c.lindex(key, 6, function (err, data) {
          assert.ok(!err);
          assert.equal(data, null, 'should be null');

          next();
        })
      }
    }, function () {
      done();
    })
  })

  it('LLEN: should return len of array', function (done) {
    var key = crypto.randomBytes(8).toString('hex')
      , val1 = crypto.randomBytes(8).toString('hex')
      , val2 = crypto.randomBytes(8).toString('hex')
      , val3 = crypto.randomBytes(8).toString('hex');

    async.series({
      check: function (next) {
        c.exists(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not exists');

          next();
        })
      },
      rpush: function (next) {
        c.rpush(key, val1, val2, val3, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return len of list');

          next();
        })
      },
      llen: function (next) {
        c.llen(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 3, 'should return 3 as len of list');

          next()
        })
      }
    }, function () {
      done();
    })
  })

  it('LEN: should return 0 as len of non existing key', function (done) {
    var key = crypto.randomBytes(8).toString('hex');

    async.series({
      check: function (next) {
        c.exists(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 if not exists');

          next();
        })
      },
      llen: function (next) {
        c.llen(key, function (err, data) {
          assert.ok(!err);
          assert.equal(data, 0, 'should return 0 as len of list');

          next()
        })
      }
    }, function () {
      done();
    })
  })

});

