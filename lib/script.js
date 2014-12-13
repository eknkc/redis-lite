"use strict";

var crypto = require("crypto");

function Script(client, lua) {
  this.client = client;
  this.lua = lua;
  this.hash = crypto.createHash("sha1").update(lua).digest("hex");
}

Script.prototype.eval = function(keys, vals, next) {
  if (typeof vals == 'function') {
    next = vals;
    vals = []
  };

  var self = this
    , args = [this.hash, keys.length].concat(keys).concat(vals)

  this.client.sendCommand("EVALSHA", args, function (err, data) {
    if (err && /NOSCRIPT/.test(err.message)) {
      args[0] = self.lua;
      return self.client.sendCommand("EVAL", args, next);
    }

    if (err)
      return next(err);

    next(null, data);
  });
};

module.exports = Script;
