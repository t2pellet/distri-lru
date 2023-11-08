import nearestPoint from '@turf/nearest-point';
import { publicIpv4 } from 'public-ip';
import geoLocateIP from './geo';
import Cache, { CacheInfo, CacheInterface } from './cache';
import { FeatureCollection, Point, point } from '@turf/helpers';

export type CacheMap = { loc: [number, number]; cache: CacheInfo }[];

class DistributedLRUCache {
  private regions: FeatureCollection<Point>;

  constructor(redisMap: CacheMap) {
    this.regions = {
      type: 'FeatureCollection',
      features: [...redisMap.map(({ loc, cache }) => point(loc, { cache }))],
    };
  }

  async get(key: string, options?: { ip?: string }): Promise<object | undefined | null> {
    const userIp = options?.ip || (await publicIpv4());
    const cache = await this.for(userIp);
    if (cache != null) {
      return cache.get(key);
    }
    return null;
  }

  async put(key: string, val: object, options?: { ip?: string; ttl?: number }): Promise<boolean> {
    const userIp = options?.ip || (await publicIpv4());
    const cache = await this.for(userIp);
    if (cache != null) {
      return await cache.put(key, val, options?.ttl);
    }
    return false;
  }

  async del(key: string, options?: { ip?: string }): Promise<boolean> {
    const userIp = options?.ip || (await publicIpv4());
    const cache = await this.for(userIp);
    if (cache != null) {
      return await cache.del(key);
    }
    return false;
  }

  async for(ip: string): Promise<CacheInterface | null> {
    const result = await geoLocateIP(ip);
    if (result != null) {
      const { point } = result;
      const info: CacheInfo = nearestPoint(point, this.regions).properties.cache;
      return new Cache(info);
    }
    return null;
  }
}

export default DistributedLRUCache;
