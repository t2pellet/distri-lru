import axios, { AxiosError, AxiosInstance } from 'axios';
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
  readonly info: CacheInfo;

  constructor(info: CacheInfo) {
    this.info = info;
    // Sanitize baseUrl
    const baseURL =
      info.host.startsWith('http://') || info.host.startsWith('https://')
        ? `${info.host}:${info.port}`
        : `http://${info.host}:${info.port}`;
    this.axios = axios.create({ baseURL, timeout: 1000 });
    axiosRetry(this.axios, { retries: 3 });
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.axios.delete(`${key}`);
      return true;
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error('Failed to delete: ' + axiosErr.message);
      return false;
    }
  }

  async get(key: string): Promise<object | undefined | null> {
    try {
      const result = await this.axios.get(`${key}`);
      const { value } = result.data;
      return value;
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error('Failed to delete: ' + axiosErr.message);
      return null;
    }
  }

  async put(key: string, value: object, ttl?: number): Promise<boolean> {
    try {
      await this.axios.post(`${key}`, { value, ttl });
      return true;
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error('Failed to delete: ' + axiosErr.message);
      return false;
    }
  }
}

export default Cache;
