module.exports = {
  'APPEND': {
    key: 0
  },
  'AUTH': {
    duplicate: true,
    nokeys: true
  },
  'BGREWRITEAOF': {
    duplicate: true,
    nokeys: true
  },
  'BGSAVE': {
    duplicate: true,
    nokeys: true
  },
  'BITCOUNT': {
    key: 0
  },
  'BITOP': {
    supported: false
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
    duplicate: true,
    nokeys: true
  },
  'CLIENT LIST': {
    duplicate: true,
    nokeys: true
  },
  'CLIENT GETNAME': {
    duplicate: true,
    nokeys: true
  },
  'CLIENT PAUSE': {
    duplicate: true,
    nokeys: true
  },
  'CLIENT SETNAME': {
    duplicate: true,
    nokeys: true
  },
  'CLUSTER SLOTS': {
    duplicate: true,
    nokeys: true
  },
  'COMMAND': {
    duplicate: true,
    nokeys: true
  },
  'COMMAND COUNT': {
    duplicate: true,
    nokeys: true
  },
  'COMMAND GETKEYS': {
    duplicate: true,
    nokeys: true
  },
  'COMMAND INFO': {
    duplicate: true,
    nokeys: true
  },
  'CONFIG GET': {
    duplicate: true,
    nokeys: true
  },
  'CONFIG REWRITE': {
    duplicate: true,
    nokeys: true
  },
  'CONFIG SET': {
    duplicate: true,
    nokeys: true
  },
  'CONFIG RESETSTAT': {
    duplicate: true,
    nokeys: true
  },
  'DBSIZE': {
    duplicate: true,
    nokeys: true
  },
  'DEBUG OBJECT': {
    key: 0
  },
  'DEBUG SEGFAULT': {
    duplicate: true,
    nokeys: true
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
    duplicate: true,
    nokeys: true
  },
  'DUMP': {
    key: 0
  },
  'ECHO': {
    duplicate: true,
    nokeys: true
  },
  'EVAL': {
    supported: false
  },
  'EVALSHA': {
    supported: false
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
    duplicate: true,
    nokeys: true
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
        next(null, data);
      })
    }
  },
  'MIGRATE': {
    supported: false
  },
  'MONITOR': {
    duplicate: true,
    nokeys: true
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
    duplicate: true,
    nokeys: true
  },
  'OBJECT': {
    duplicate: true,
    nokeys: true
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
    keys: function(args) { return range(args); }
  },
  'PFMERGE': {
    supported: false
  },
  'PING': {
    duplicate: true,
    nokeys: true
  },
  'PSETEX': {
    key: 0
  },
  'PSUBSCRIBE': {
    duplicate: true,
    nokeys: true
  },
  'PUBSUB': {
    duplicate: true,
    nokeys: true
  },
  'PTTL': {
    key: 0
  },
  'PUBLISH': {
    duplicate: true,
    nokeys: true
  },
  'PUNSUBSCRIBE': {
    duplicate: true,
    nokeys: true
  },
  'QUIT': {
    duplicate: true,
    nokeys: true
  },
  'RANDOMKEY': {
    duplicate: true,
    nokeys: true
  },
  'RENAME': {
    supported: false
  },
  'RENAMENX': {
    supported: false
  },
  'RESTORE': {
    key: 0
  },
  'ROLE': {
    duplicate: true,
    nokeys: true
  },
  'RPOP': {
    key: 0
  },
  'RPOPLPUSH': {
    supported: false
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
    duplicate: true,
    nokeys: true
  },
  'SCARD': {
    key: 0
  },
  'SCRIPT EXISTS': {
    duplicate: true,
    nokeys: true
  },
  'SCRIPT FLUSH': {
    duplicate: true,
    nokeys: true
  },
  'SCRIPT KILL': {
    duplicate: true,
    nokeys: true
  },
  'SCRIPT LOAD': {
    duplicate: true,
    nokeys: true
  },
  'SDIFF': {
    keys: function(args) { return range(args); }
  },
  'SDIFFSTORE': {
    supported: false
  },
  'SELECT': {
    duplicate: true,
    nokeys: true
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
    duplicate: true,
    nokeys: true
  },
  'SINTER': {
    keys: function(args) { return range(args); }
  },
  'SINTERSTORE': {
    supported: false
  },
  'SISMEMBER': {
    key: 0
  },
  'SLAVEOF': {
    duplicate: true,
    nokeys: true
  },
  'SLOWLOG': {
    duplicate: true,
    nokeys: true
  },
  'SMEMBERS': {
    key: 0
  },
  'SMOVE': {
    supported: false
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
    duplicate: true,
    nokeys: true
  },
  'SUNION': {
    keys: function(args) { return range(args); }
  },
  'SUNIONSTORE': {
    supported: false
  },
  'SYNC': {
    duplicate: true,
    nokeys: true
  },
  'TIME': {
    duplicate: true,
    nokeys: true
  },
  'TTL': {
    key: 0
  },
  'TYPE': {
    key: 0
  },
  'UNSUBSCRIBE': {
    duplicate: true,
    nokeys: true
  },
  'UNWATCH': {
    duplicate: true,
    nokeys: true
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
    supported: false
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
    supported: false
  },
  'SCAN': {
    duplicate: true,
    nokeys: true
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

function range(arr) {

}

function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

function groupOperation(c, cmd, args, next) {
  if (!args.length)
    return next(new Error("Invalid arguments"));

  if (args.length == 1)
    return c.sendToServer(c.serverNameForKey(args[0]), cmd, args, next);

  var groups = {};

  args.forEach(function (arg) {
    var server = c.serverNameForKey(arg);
    groups[server] = groups[server] || { args: [] };
    groups[server].args.push(arg);
  });

  var servers = Object.keys(groups)
    , ops = servers.length

  servers.forEach(function (server) {
    c.sendToServer(server, cmd, groups[server].args, function (err, data) {
      if (err) {
        ops = 0;
        return next(err);
      }

      groups[server].result = data;

      if (--ops <= 0)
        next(null, groups);
    })
  })
}
