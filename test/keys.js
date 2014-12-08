var assert = require('assert')
  , async = require('async')
  , helpers = require('./helpers.js');


describe('Keys', function () {
  var c = helpers.client();

  it('DEL', function (done) {

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
