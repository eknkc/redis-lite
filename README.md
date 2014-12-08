# redis-lite

`redis-lite` is a lightweight and *fast* redis client for Node.JS with consistent hashing / sharding.

 - Distributes keys over multiple redis servers using a consistent hashing algorithm.
 - Auto reconnect / failover mechanisms built in.
 - Pipelines requests for improved throughtput.
 - Can pool connections.

## install

```
npm install redis-lite
```

## connecting

```js
var redis = require("redis-lite");
var client = redis(servers, options);
```

### servers
The server list can either be a string, array or object.

  - *string*: single server. use `hostname:port` or `hostname` for default port.
  - *array*: array of strings, keys will be distributed over these hosts.
  - *object*: different weights for different servers. `{"hostname1": 1, "hostname2": 2}` will cause hostname2 to have twica as many load as the hostname1.

### options

  - `socketNoDelay`: (default: `true`) set no delay setting on underlying sockets. set false to improve throughput but that would increase latency.
  - `socketKeepAlive`: (default: `true`) enable keep alive functionality on underlying sockets.
  - `retryDelay`: (default: `2000`) wait milliseconds before trying to reconnect a failed server connection.
  - `removeTimeout`: (default: `null`) wait milliseconds before marking a server dead and removing it from distribution. this will cause the keys on this server to be shifted onto others. by default, unavailable servers will be tried indefinately for reconnection.
  - `replacementHosts`: (default: `[]`) supply additional hostnames for failover. this setting requires a `removeTimeout` duration, however, client will replace dead servers with one from this list instead of simply removing them.
  - `connectionsPerServer`: (default: `1`) use n connections for each server. note that the client already does pipelining on a single connection, you do not need a lot of connections.
  - `enableOfflineQueue`: (default: `true`) if there is no active connection to a specific server, queue commands until we can acquire one.
  - `keyPrefix`: (default: `''`) prefix all keys with a string, useful for namespacing keys.
  - `hashLongKeys`: (default: `true`) redis keys can not be larger than 255 bytes lenght. set this true if you want the client to hash larger keys to fit into 255 character length limit.

```
var client = redis("localhost:11211", { retryDelay: 5000, removeTimeout: 20000 });
```

## author

Ekin Koc

## license

MIT
