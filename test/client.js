var assert = require('assert')
  , async = require('async')
  , helpers = require('./helpers.js');


describe('CLIENT', function () {
  var c = helpers.client();

  it('list', function(done){
    c.sendCommand('CLIENT LIST', function (err, data) {
      console.log(err, data);
      assert.ok(data);
      done();
    });

  });
});
