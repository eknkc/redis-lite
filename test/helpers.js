var redis = require("../");

module.exports.client = function () {
  return redis(['localhost:6379', 'localhost:8888', 'localhost:9999'], { removeTimeout: 1000 });
}
