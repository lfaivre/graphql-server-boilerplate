import Redis from 'ioredis';
import { DEFAULT_HOST_REDIS, DEFAULT_PORT_REDIS } from './constants';

const redisHost = process.env.GATEWAY_DEV_REDIS_HOST
  ? `redis://${process.env.GATEWAY_DEV_REDIS_HOST}`
  : `redis://${DEFAULT_HOST_REDIS}`;
const redisPort = process.env.GATEWAY_DEV_REDIS_PORT || DEFAULT_PORT_REDIS;

export const redis = new Redis(redisPort as number, redisHost);
