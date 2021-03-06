var EventEmitter = require('events').EventEmitter;
var Connection = require("./connection.js");
var OfflineQueue = require("./offline-queue.js")
var util = require('util');

util.inherits(Server, EventEmitter);

function Server(host, options) {
  if (!(this instanceof Server))
    return new Server(host, options);

  EventEmitter.call(this);

  this.host                 = host;
  this.connected            = false;
  this.weight               = host.weight;
  this.removeTimeout        = options.removeTimeout;
  this.connectionsPerServer = options.connectionsPerServer || 1;
  this.enableOfflineQueue   = typeof options.enableOfflineQueue == 'undefined' ? true : !!options.enableOfflineQueue;

  this.connectionOptions = {
    socketNoDelay   : options.socketNoDelay,
    socketKeepAlive : options.socketKeepAlive,
    retryDelay      : options.retryDelay,
    host            : host,
  };

  if (this.enableOfflineQueue) {
    this.offlineQueue = new OfflineQueue();

    this.on('connect', function () {
      this.offlineQueue.drain().forEach(function (entry) {
        this.sendCommand(entry.cmd, entry.args, entry.handler);
      }.bind(this));
    }.bind(this));
  }

  this.connections = this._createConnections();
}

Server.prototype.sendCommand = function(cmd, args, next) {
  if (this.connections.length == 1) {
    var conn = this.connections[0];
    if (conn.connected) return conn.write(cmd, args, next);
  } else {
    var pf = Math.floor(Math.random() * this.connections.length);

    for (var i = 0; i < this.connections.length; i++) {
      var conn = this.connections[(i + pf) % this.connections.length];

      if (conn.connected) {
        conn.write(cmd, args, next);
        return;
      }
    };
  }

  if (this.offlineQueue) {
    this.offlineQueue.push(cmd, args, next);
  } else if (next) {
    next(new Error("Unable to acquire connection to server " + this.host.string));
  }
};

Server.prototype._createConnections = function() {
  var conns = [];

  for (var i = 0; i < this.connectionsPerServer; i++) {
    var conn = new Connection(this.host, this.connectionOptions);
    conn.on("connect", this._checkState.bind(this));
    conn.on("reconnect", this._checkState.bind(this));
    conn.on("error", this._checkState.bind(this));
    conns.push(conn);
  };

  return conns;
};

Server.prototype._checkState = function() {
  var oldstate = this.connected;
  this.connected = false;

  if (this.ended)
    return;

  for (var i = 0; i < this.connections.length; i++) {
    if (this.connections[i].connected)
      this.connected = true;
  };

  if (this.connected && !oldstate)
    this.emit("connect");

  if (!this.connected) {
    if (this.removeTimeout && !this._removeTimer) {
      this._removeTimer = setTimeout(function() {
        if (this.connected) return;
        this.emit("remove");
        this.end();
      }.bind(this), this.removeTimeout);
    } else if (!this.removeTimeout) {
      this.emit('reconnect');
    }
  } else if (this._removeTimer) {
    clearTimeout(this._removeTimer);
    this._removeTimer = null;
  }
};

Server.prototype.end = function() {
  this.connections.forEach(function (conn) {
    conn.end();
  });

  this.offlineQueue.flush(new Error("Server connection lost to " + this.host.string));
  this.offlineQueue = null;
  this.connected = false;
  this.ended = true;
};

module.exports = Server;
