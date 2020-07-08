import { Redis } from 'ioredis';
import { USER_SESSION_ID_PREFIX, REDIS_SESSION_PREFIX } from '../constants';

export const removeAllUserSessions = async (userId: string, redis: Redis): Promise<void> => {
  const sessionIds = await redis.lrange(`${USER_SESSION_ID_PREFIX}${userId}`, 0, -1);

  await sessionIds.reduce(async (promise, id) => {
    await promise;
    await redis.del(`${REDIS_SESSION_PREFIX}${id}`);
  }, Promise.resolve());
};
