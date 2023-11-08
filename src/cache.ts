import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

export interface CacheInterface {
  get(key: string): Promise<object | undefined | null>;
  put(key: string, val: object, ttl?: number): Promise<boolean>;
  del(key: string): Promise<boolean>;
}

export type CacheInfo = {
  host: string;
  port: number;
};

class Cache implements CacheInterface {
  private readonly axios: AxiosInstance;

  constructor(info: CacheInfo) {
    this.axios = axios.create({ baseURL: `${info.host}:${info.port}/`, timeout: 1000 });
    axiosRetry(this.axios, { retries: 3 });
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.axios.delete(`${key}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async get(key: string): Promise<object | undefined | null> {
    try {
      const result = await this.axios.get(`${key}`);
      const { value } = result.data;
      return value;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async put(key: string, value: object, ttl?: number): Promise<boolean> {
    try {
      await this.axios.post(`${key}`, { value, ttl });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default Cache;
