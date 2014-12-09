function OfflineQueue() {
  this.queue = [];
};

function Command(cmd, args, handler) {
  this.cmd = cmd;
  this.args = args;
  this.handler = handler;
};

Command.prototype.toArray = function() {
  return [this.cmd].concat(this.args).concat([this.handler]);
};

OfflineQueue.prototype.push = function(cmd, args, next) {
  this.queue.push(new Command(cmd, args, next));
};

OfflineQueue.prototype.drain = function() {
  var data = this.queue;
  this.queue = [];
  return data;
};

OfflineQueue.prototype.flush = function(err) {
  this.drain().forEach(function (entry) {
    entry.handler(err);
  });
};

module.exports = OfflineQueue;
