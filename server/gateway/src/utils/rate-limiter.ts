import rateLimit, { RateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';

export const limiter = (client: Redis): RateLimit => {
  const store = new RedisStore({ client });
  const options = { store, windowMs: 15 * 60 * 1000, max: 5, delayMs: 0 };
  return rateLimit(options);
};
