var EventEmitter = require('events').EventEmitter;
var Server = require("./server.js");
var util = require('util');
var crypto = require("crypto");
var consistent = require("consistent");
var conparse = require("connection-parse");
var commands = require("./commands.js");

util.inherits(Client, EventEmitter);

function Client(hosts, options) {
  if (!(this instanceof Client))
    return new Client(hosts, options);

  EventEmitter.call(this);

  options = options || {};

  this.hosts = conparse(hosts).servers;
  this.replacementHosts = conparse(options.replacementHosts || []).servers;

  this.serverOptions = {
    socketNoDelay        : options.socketNoDelay,
    socketKeepAlive      : options.socketKeepAlive,
    removeTimeout        : options.removeTimeout,
    retryDelay           : options.retryDelay,
    connectionsPerServer : options.connectionsPerServer,
    enableOfflineQueue   : options.enableOfflineQueue
  }

  this.ring = consistent();
  this._createServers();
}

Client.prototype.sendCommand = function(cmd) {
  var args = [].slice.call(arguments, 1)
    , command = commands[cmd]
    , next

  if (typeof args[args.length - 1] == 'function')
    next = args.pop();
  else
    next = function() {};

  if (command && command.supported !== false) {
    if (command.router)
      return command.router(this, args, next);

    if (this.ring.members.length == 1)
      return this.sendToServer(this.serverNameForKey(this.ring.members[0].key), cmd, args, next);

    if (typeof command.key != 'undefined')
      return this.sendToServer(this.serverNameForKey(args[command.key]), cmd, args, next);
  }

  next(new Error("Command not supported: " + cmd))
};

Client.prototype.serverNameForKey = function(key) {
  key = String(key);

  for (var i = 0; i < key.length; i++) {
    if (key.charAt(i) == '{') {
      for (var j = i + 1; j < key.length; j++) {
        if (key.charAt(j) == '}') {
          key = key.substring(i + 1, j);
          break;
        }
      };

      break;
    }
  };

  return this.ring.getCached(key);
};

Client.prototype.sendToServer = function(name, cmd, args, next) {
  var server = this.servers[name];

  if (!server)
    return next(new Error("Unable to acquire any server connections."));

  server.sendCommand(cmd, args, next);
};

Client.prototype.getServers = function(name) {
  return this.servers[name];
};

Object.keys(commands).forEach(function (cmd) {
  var info = commands[cmd];

  if (info.supported === false)
    return;

  Client.prototype[cmd] = Client.prototype[cmd.toLowerCase()] = function() {
    this.sendCommand.apply(this, [cmd].concat([].slice.call(arguments)));
  };
});

Client.prototype.end = function() {
  Object.keys(this.servers).forEach(function (host) {
    this.servers[host].end();
  }.bind(this));

  this.ended = true;
};

Client.prototype._makeError = function(status) {
  var err = new Error(status.message);
  err.code = status.code;
  err.key = status.key;
  return err;
}

Client.prototype._createServers = function() {
  this.servers = {};

  var addServer = function(host, replacementOf) {
    host.port = host.port || 6379;
    var server = this.servers[host.string] = new Server(host, this.serverOptions);

    server.on('remove', function () {
      delete this.servers[host.string];

      if (this.replacementHosts.length) {
        var nhost = this.replacementHosts.shift();
        addServer(nhost, host);
      } else {
        this.ring.remove(host.string);
      }
    }.bind(this));

    if (replacementOf)
      this.ring.replace({ key: replacementOf.string }, { key: host.string, weight: host.weight });
    else
      this.ring.add({ key: host.string, weight: host.weight });
  }.bind(this);

  this.hosts.forEach(function(host) {
    addServer(host);
  });
};

module.exports = Client;
