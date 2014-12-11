var EventEmitter = require('events').EventEmitter;
var util = require('util');
var net = require("net");
var hiredis = require("hiredis");

util.inherits(Connection, EventEmitter);

function Connection(host, options) {
  if (!(this instanceof Connection))
    return new Connection(host, options);

  EventEmitter.call(this);

  this.host            = host;
  this.retryDelay      = options.retryDelay | 2000;
  this.socketNoDelay   = typeof options.socketNoDelay == 'undefined' ? true : !!options.socketNoDelay;
  this.socketKeepAlive = typeof options.socketKeepAlive == 'undefined' ? true : !!options.socketKeepAlive;

  this.stream = net.createConnection(this.host.port, this.host.host);

  if (this.socketNoDelay)
    this.stream.setNoDelay(true);

  this.stream.setKeepAlive(this.socketKeepAlive);
  this.stream.setTimeout(0);

  this.reader = new hiredis.Reader();

  this.handlers = [];
  this._attachEvents();
}

Connection.prototype.write = function(cmd, pack, handler) {
  this.handlers.push(handler);

  var cmd = "*" + (pack.length + 1) + "\r\n$" + cmd.length + "\r\n" + cmd + "\r\n";

  for (var i = 0; i < pack.length; i++) {
    var item = pack[i];

    if (Buffer.isBuffer(item)) {
      if (cmd) {
        this.stream.write(cmd);
        cmd = "";
      }

      this.stream.write("$" + item.length + "\r\n");
      this.stream.write(item);
      this.stream.write("\r\n");
    } else {
      item = String(item);
      cmd += "$" + Buffer.byteLength(item) + "\r\n" + item + "\r\n";
    }
  };

  if (cmd)
    this.stream.write(cmd);
};

Connection.prototype._attachEvents = function() {
  var self = this;

  self.stream.on('connect', function () {
    self.connected = true;
    self.emit('connect');
    self.reader = new hiredis.Reader();
  });

  self.stream.on('close', self._connectionLost.bind(self, 'close'));
  self.stream.on('end', self._connectionLost.bind(self, 'end'));
  self.stream.on('error', function (msg) {
    self.emit('error', new Error("redis-lite connection to " + self.host.string + " failed: " + msg));
    self._connectionLost('error');
  })

  self.stream.on('data', function (data) {
    self.reader.feed(data);

    var response;
    while(true) {
      try {
        response = self.reader.get();
      } catch(e) {
        self.emit('error', "Parser error: " + e.message);
        return self.stream.destroy();
      }

      if (response === undefined)
        return;

      var handler = self.handlers.shift();

      if (response && response.constructor == Error)
        handler(response);
      else
        handler(null, response);
    }
  });
};

Connection.prototype._connectionLost = function(reason) {
  if (this.ended || this.reconnecting)
    return;

  this.connected = false;
  this.reconnecting = true;

  this.handlers.forEach(function (handler) {
    handler(new Error("Server connection lost to " + this.host.string));
  }.bind(this));
  this.handlers = [];

  this.emit('reconnect');

  this._retryTimer = setTimeout(function() {
    this.reconnecting = false;
    this.stream.connect(this.host.port, this.host.host);
  }.bind(this), this.retryDelay);
};

Connection.prototype.end = function() {
  if (this.ended)
    return;

  this.stream.end();
  this.ended = true;
  this.connected = false;
  this.emit('end');

  clearTimeout(this._retryTimer);
};

module.exports = Connection;
