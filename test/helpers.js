var SERVERS = ["localhost", "127.0.0.1"];

var redis = require("../");

module.exports.client = function () {
  return redis(SERVERS, { removeTimeout: 1000 });
}
