var EventEmitter = require('events').EventEmitter;
var Server = require("./server.js");
var OfflineQueue = require("./offline-queue.js")
var Script = require("./script.js");
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

  this.serverOptions = {
    socketNoDelay        : options.socketNoDelay,
    socketKeepAlive      : options.socketKeepAlive,
    removeTimeout        : options.removeTimeout,
    retryDelay           : options.retryDelay,
    connectionsPerServer : options.connectionsPerServer,
    enableOfflineQueue   : options.enableOfflineQueue
  }

  if (typeof hosts == 'function') {
    this.offlineQueue = new OfflineQueue();

    hosts(function(err, result) {
      if (err) {
        this.emit("error", this._makeError({ message: "Discovery failed: " + err.message, code: "DISCOVERY_FAILED" }));
        return this.end();
      }

      this._connect(result.hosts ? result : { hosts: result });
    }.bind(this));
  } else {
    this._connect({
      hosts: hosts,
      replacementHosts: options.replacementHosts
    });
  }
}

Client.prototype.sendCommand = function(cmd) {
  var args = [].slice.call(arguments, 1)
    , command = commands[cmd]
    , next

  if (typeof args[args.length - 1] == 'function')
    next = args.pop();
  else
    next = function() {};

  if (this.ended)
    return next(new Error("Client has been ended."));

  if (this.offlineQueue)
    return this.offlineQueue.push(cmd, args, next);

  if (args.length == 1 && Array.isArray(args[0]))
    args = args[0];

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

Client.prototype.createScript = function(lua) {
  return new Script(this, lua);
};

Client.prototype.end = function() {
  Object.keys(this.servers).forEach(function (host) {
    this.servers[host].end();
  }.bind(this));

  if (this.offlineQueue) {
    this.offlineQueue.flush("Client ended");
    delete this.offlineQueue;
  }

  this.ended = true;
  this.emit('end');
};

Client.prototype._connect = function(hostconfig) {
  this.discovering = false;

  this.hosts = conparse(hostconfig.hosts).servers;
  this.replacementHosts = conparse(hostconfig.replacementHosts || []).servers;

  this.ring = consistent({ hash: "murmurhash" });
  this._createServers();

  if (this.offlineQueue) {
    var commands = this.offlineQueue.drain();
    delete this.offlineQueue;

    commands.forEach(function (entry) {
      this.sendCommand.apply(this, entry.toArray());
    }.bind(this));
  }
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

      if (!Object.keys(this.servers).length)
        this.emit("error", this._makeError({ message: "No server connections available.", code: "NO_CONNECTIONS" }));
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
