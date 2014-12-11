module.exports = {
  'APPEND': {
    key: 0
  },
  'AUTH': {
    router: function(c, args, next) {
      fanoutOperation(c, "AUTH", args, next);
    }
  },
  'BGREWRITEAOF': {
    router: function(c, args, next) {
      fanoutOperation(c, "BGREWRITEAOF", args, next);
    }
  },
  'BGSAVE': {
    router: function(c, args, next) {
      fanoutOperation(c, "BGSAVE", args, next);
    }
  },
  'BITCOUNT': {
    key: 0
  },
  'BITOP': {
    router: function(c, args, next) {
      singleServerOperation(c, "BITOP", args, args.slice(1), next);
    }
  },
  'BITPOS': {
    key: 0
  },
  'BLPOP': {
    supported: false
  },
  'BRPOP': {
    supported: false
  },
  'BRPOPLPUSH': {
    supported: false
  },
  'CLIENT KILL': {
    router: function(c, args, next) {
      fanoutOperation(c, "CLIENT KILL", args, next);
    }
  },
  'CLIENT LIST': {
    supported: false
  },
  'CLIENT GETNAME': {
    supported: false
  },
  'CLIENT PAUSE': {
    supported: false
  },
  'CLIENT SETNAME': {
    supported: false
  },
  'CLUSTER SLOTS': {
    supported: false
  },
  'COMMAND': {
    supported: false
  },
  'COMMAND COUNT': {
    supported: false
  },
  'COMMAND GETKEYS': {
    supported: false
  },
  'COMMAND INFO': {
    supported: false
  },
  'CONFIG GET': {
    supported: false
  },
  'CONFIG REWRITE': {
    supported: false
  },
  'CONFIG SET': {
    supported: false
  },
  'CONFIG RESETSTAT': {
    supported: false
  },
  'DBSIZE': {
    router: function(c, args, next) {
      fanoutOperation(c, "DBSIZE", args, function (err, data) {
        if (err) return next(err);

        next(null, data.reduce(function (m, c) {
          return m + c;
        }, 0));
      });
    }
  },
  'DEBUG': {
    supported: false
  },
  'DECR': {
    key: 0
  },
  'DECRBY': {
    key: 0
  },
  'DEL': {
    router: function(c, args, next) {
      groupOperation(c, "DEL", args, function (err, data) {
        if (err) return next(err);
        var sum = values(data).reduce(function (a, b) {
          return a + b.result;
        }, 0);
        next(null, sum);
      })
    }
  },
  'DISCARD': {
    supported: false
  },
  'DUMP': {
    key: 0
  },
  'ECHO': {
    duplicate: true,
    nokeys: true
  },
  'EVAL': {
    router: function(c, args, next) {
      var numkeys = parseInt(args[1], 10);

      if (!numkeys)
        fanoutOperation(c, "EVAL", args, next);
      else
        singleServerOperation(c, "EVAL", args, args.slice(2, 2 + numkeys), next);
    }
  },
  'EVALSHA': {
    router: function(c, args, next) {
      var numkeys = parseInt(args[1], 10);

      if (!numkeys)
        fanoutOperation(c, "EVALSHA", args, next);
      else
        singleServerOperation(c, "EVALSHA", args, args.slice(2, 2 + numkeys), next);
    }
  },
  'EXEC': {
    duplicate: true,
    nokeys: true
  },
  'EXISTS': {
    key: 0
  },
  'EXPIRE': {
    key: 0
  },
  'EXPIREAT': {
    key: 0
  },
  'FLUSHALL': {
    duplicate: true,
    nokeys: true
  },
  'FLUSHDB': {
    duplicate: true,
    nokeys: true
  },
  'GET': {
    key: 0
  },
  'GETBIT': {
    key: 0
  },
  'GETRANGE': {
    key: 0
  },
  'GETSET': {
    key: 0
  },
  'HDEL': {
    key: 0
  },
  'HEXISTS': {
    key: 0
  },
  'HGET': {
    key: 0
  },
  'HGETALL': {
    key: 0
  },
  'HINCRBY': {
    key: 0
  },
  'HINCRBYFLOAT': {
    key: 0
  },
  'HKEYS': {
    key: 0
  },
  'HLEN': {
    key: 0
  },
  'HMGET': {
    key: 0
  },
  'HMSET': {
    key: 0
  },
  'HSET': {
    key: 0
  },
  'HSETNX': {
    key: 0
  },
  'HVALS': {
    key: 0
  },
  'INCR': {
    key: 0
  },
  'INCRBY': {
    key: 0
  },
  'INCRBYFLOAT': {
    key: 0
  },
  'INFO': {
    router: function(c, args, next) {
      fanoutOperation(c, "INFO", args, next);
    }
  },
  'KEYS': {
    duplicate: true,
    nokeys: true
  },
  'LASTSAVE': {
    duplicate: true,
    nokeys: true
  },
  'LINDEX': {
    key: 0
  },
  'LINSERT': {
    key: 0
  },
  'LLEN': {
    key: 0
  },
  'LPOP': {
    key: 0
  },
  'LPUSH': {
    key: 0
  },
  'LPUSHX': {
    key: 0
  },
  'LRANGE': {
    key: 0
  },
  'LREM': {
    key: 0
  },
  'LSET': {
    key: 0
  },
  'LTRIM': {
    key: 0
  },
  'MGET': {
    router: function(c, args, next) {
      groupOperation(c, "MGET", args, function (err, data) {
        if (err) return next(err);
        var result = [];

        Object.keys(data).forEach(function (server) {
          var res = data[server];

          for (var i = 0; i < res.result.length; i++) {
            result[res.indexes[i]] = res.result[i];
          };
        })

        next(null, result);
      })
    }
  },
  'MIGRATE': {
    key: 2
  },
  'MONITOR': {
    supported: false
  },
  'MOVE': {
    key: 0
  },
  'MSET': {
    supported: false
  },
  'MSETNX': {
    supported: false
  },
  'MULTI': {
    supported: false
  },
  'OBJECT': {
    supported: false
  },
  'PERSIST': {
    key: 0
  },
  'PEXPIRE': {
    key: 0
  },
  'PEXPIREAT': {
    key: 0
  },
  'PFADD': {
    key: 0
  },
  'PFCOUNT': {
    router: function(c, args, next) {
      groupOperation(c, "PFCOUNT", args, function (err, data) {
        if (err) return next(err);
        var sum = values(data).reduce(function (a, b) {
          return a + b.result;
        }, 0);
        next(null, sum);
      })
    }
  },
  'PFMERGE': {
    router: function(c, args, next) {
      singleServerOperation(c, "PFMERGE", args, next);
    }
  },
  'PING': {
    router: function(c, args, next) {
      fanoutOperation(c, "PING", args, function (err, data) {
        if (err) return next(err);
        next(null, "PONG");
      });
    }
  },
  'PSETEX': {
    key: 0
  },
  'PSUBSCRIBE': {
    supported: false
  },
  'PUBSUB': {
    supported: false
  },
  'PTTL': {
    key: 0
  },
  'PUBLISH': {
    supported: false
  },
  'PUNSUBSCRIBE': {
    supported: false
  },
  'QUIT': {
    router: function(c, args, next) {
      c.end();
      next();
    }
  },
  'RANDOMKEY': {
    router: function(c, args, next) {
      var servers = Object.keys(c.servers)
        , sel = servers[Math.floor(Math.random() * servers.length)]

      c.sendToServer(sel, 'RANDOMKEY', args, next);
    }
  },
  'RENAME': {
    router: function(c, args, next) {
      singleServerOperation(c, "RENAME", args, next);
    }
  },
  'RENAMENX': {
    router: function(c, args, next) {
      singleServerOperation(c, "RENAMENX", args, next);
    }
  },
  'RESTORE': {
    key: 0
  },
  'ROLE': {
    router: function(c, args, next) {
      fanoutOperation(c, "ROLE", args, next);
    }
  },
  'RPOP': {
    key: 0
  },
  'RPOPLPUSH': {
    router: function(c, args, next) {
      singleServerOperation(c, "RPOPLPUSH", args, next);
    }
  },
  'RPUSH': {
    key: 0
  },
  'RPUSHX': {
    key: 0
  },
  'SADD': {
    key: 0
  },
  'SAVE': {
    router: function(c, args, next) {
      fanoutOperation(c, "SAVE", args, next);
    }
  },
  'SCARD': {
    key: 0
  },
  "SCRIPT": {
    router: function(c, args, next) {
      fanoutOperation(c, "SCRIPT", args, next);
    }
  },
  'SDIFF': {
    router: function(c, args, next) {
      singleServerOperation(c, "SDIFF", args, next);
    }
  },
  'SDIFFSTORE': {
    router: function(c, args, next) {
      singleServerOperation(c, "SDIFFSTORE", args, next);
    }
  },
  'SELECT': {
    router: function(c, args, next) {
      fanoutOperation(c, "SELECT", args, next);
    }
  },
  'SET': {
    key: 0
  },
  'SETBIT': {
    key: 0
  },
  'SETEX': {
    key: 0
  },
  'SETNX': {
    key: 0
  },
  'SETRANGE': {
    key: 0
  },
  'SHUTDOWN': {
    router: function(c, args, next) {
      fanoutOperation(c, "SHUTDOWN", args, next);
    }
  },
  'SINTER': {
    router: function(c, args, next) {
      singleServerOperation(c, "SINTER", args, next);
    }
  },
  'SINTERSTORE': {
    router: function(c, args, next) {
      singleServerOperation(c, "SINTERSTORE", args, next);
    }
  },
  'SISMEMBER': {
    key: 0
  },
  'SLAVEOF': {
    supported: false
  },
  'SLOWLOG': {
    supported: false
  },
  'SMEMBERS': {
    key: 0
  },
  'SMOVE': {
    router: function(c, args, next) {
      singleServerOperation(c, "SMOVE", args, args.slice(0, args.length - 1), next);
    }
  },
  'SORT': {
    key: 0
  },
  'SPOP': {
    key: 0
  },
  'SRANDMEMBER': {
    key: 0
  },
  'SREM': {
    key: 0
  },
  'STRLEN': {
    key: 0
  },
  'SUBSCRIBE': {
    supported: false
  },
  'SUNION': {
    router: function(c, args, next) {
      singleServerOperation(c, "SUNION", args, next);
    }
  },
  'SUNIONSTORE': {
    router: function(c, args, next) {
      singleServerOperation(c, "SUNIONSTORE", args, next);
    }
  },
  'SYNC': {
    supported: false
  },
  'TIME': {
    router: function(c, args, next) {
      fanoutOperation(c, "TIME", args, next);
    }
  },
  'TTL': {
    key: 0
  },
  'TYPE': {
    key: 0
  },
  'UNSUBSCRIBE': {
    supported: false
  },
  'UNWATCH': {
    supported: false
  },
  'WATCH': {
    supported: false
  },
  'ZADD': {
    key: 0
  },
  'ZCARD': {
    key: 0
  },
  'ZCOUNT': {
    key: 0
  },
  'ZINCRBY': {
    key: 0
  },
  'ZINTERSTORE': {
    router: function(c, args, next) {
      var numkeys = parseInt(args[1], 10);

      if (isNaN(numkeys) || numkeys <= 0)
        return next(new Error("Invalid arguments"));

      singleServerOperation(c, "ZINTERSTORE", args, [args[0]].concat(args.slice(2, numkeys + 2)), next);
    }
  },
  'ZLEXCOUNT': {
    key: 0
  },
  'ZRANGE': {
    key: 0
  },
  'ZRANGEBYLEX': {
    key: 0
  },
  'ZREVRANGEBYLEX': {
    key: 0
  },
  'ZRANGEBYSCORE': {
    key: 0
  },
  'ZRANK': {
    key: 0
  },
  'ZREM': {
    key: 0
  },
  'ZREMRANGEBYLEX': {
    key: 0
  },
  'ZREMRANGEBYRANK': {
    key: 0
  },
  'ZREMRANGEBYSCORE': {
    key: 0
  },
  'ZREVRANGE': {
    key: 0
  },
  'ZREVRANGEBYSCORE': {
    key: 0
  },
  'ZREVRANK': {
    key: 0
  },
  'ZSCORE': {
    key: 0
  },
  'ZUNIONSTORE': {
    router: function(c, args, next) {
      var numkeys = parseInt(args[1], 0);

      if (isNaN(numkeys) || numkeys <= 0)
        return next(new Error("Invalid arguments"));

      singleServerOperation(c, "ZUNIONSTORE", args, [args[0]].concat(args.slice(2, numkeys + 2)), next);
    }
  },
  'SCAN': {
    // TODO: can be...
    supported: false
  },
  'SSCAN': {
    key: 0
  },
  'HSCAN': {
    key: 0
  },
  'ZSCAN': {
    key: 0
  },
};

function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

function singleServerOperation(c, cmd, args, keys, next) {
  if (typeof keys == 'function') {
    next = keys;
    keys = args;
  }

  if (!keys.length)
    return next(new Error("Invalid arguments"));

  var server;

  for (var i = 0; i < keys.length; i++) {
    var as = c.serverNameForKey(keys[i]);
    if (!server) server = as;
    if (server !== as) return next(new Error("Keys are mapped to different hash slots for command " + cmd));
  };

  c.sendToServer(server, cmd, args, next);
}

function fanoutOperation(c, cmd, args, next) {
  var results = []
    , servers = Object.keys(c.servers)
    , ops = servers.length

  servers.forEach(function (server) {
    c.sendToServer(server, cmd, args, function (err, data) {
      if (err && ops >= 0) {
        ops = -1;
        return next(err);
      }

      results.push(data);

      if (--ops == 0)
        next(null, results);
    })
  })
}

function groupOperation(c, cmd, args, next) {
  if (!args.length)
    return next(new Error("Invalid arguments"));

  if (args.length == 1)
    return c.sendToServer(c.serverNameForKey(args[0]), cmd, args, next);

  var groups = {};

  args.forEach(function (arg, i) {
    var server = c.serverNameForKey(arg);
    groups[server] = groups[server] || { args: [], indexes: [] };
    groups[server].args.push(arg);
    groups[server].indexes.push(i);
  });

  var servers = Object.keys(groups)
    , ops = servers.length

  servers.forEach(function (server) {
    c.sendToServer(server, cmd, groups[server].args, function (err, data) {
      if (err && ops >= 0) {
        ops = -1;
        return next(err);
      }

      groups[server].result = data;

      if (--ops == 0)
        next(null, groups);
    })
  })
}
