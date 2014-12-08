var redis = require("../");

module.exports.client = function  () {
  return redis('localhost');
}
