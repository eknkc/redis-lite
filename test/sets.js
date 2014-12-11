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

});
