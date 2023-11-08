# distri-lru

A library for geo-distributed LRU cache with real-time replication

## Requirements

Need to have cache servers setup as according to:
<br />
https://github.com/t2pellet/distri-lru-server

## Install

Needs `axios` installed as peer dependency

`yarn add distri-lru`

## Usage

```
import DistributedLRUCache from 'distri-lru';

const cacheNodes: CacheMap = [
    { loc: [40.7128, 74.0060], cache: { host: '127.0.0.1', port: '6379' } },
    { loc: [52.52, 13.405], cache: { host: '127.0.0.1', port: '6380' } },
    { loc: [29.3117, 47.4818], cache: { host: '127.0.0.1', port: '6381' } }
]

const dCache = new DistributedLRUCache(cacheNodes);
dCache.put('key', { value: '123' }, { ip: '45.67.89.0', ttl: 60 });
```

### Methods
1. `put(key: string, val: object, options: { ip?: string, ttl?: number }): Promise<boolean>`
2. `get(key: string, options: { ip?: string }): Promise<object | undefined | null>`
3. `del(key: string, options: { ip?: string }): Promise<boolean>`
4. `for(ip: string): Promise<CacheInterface | null>`

`CacheInterface` is the same but without the need for IP

### Features

- LRU cache with put / get / del methods
- Accesses closest cache geographically to the IP
- Realtime replication between LRU servers via https://github.com/t2pellet/distri-lru-server
- TTL for cached items
- Error safe, returns `false` on error for `put`, `del`, `for` and `null` for `get`
