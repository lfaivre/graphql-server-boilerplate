import { Redis } from 'ioredis';
import { ResolverMap, Session } from '../../types/graphql-utils';
import { USER_SESSION_ID_PREFIX, REDIS_SESSION_PREFIX } from '../../constants';
import { redis } from '../../redis';

export const resolvers: ResolverMap = {
  Mutation: {
    // eslint-disable-next-line
    logout: async (_: any, __: any, context: { session: Session }): Promise<boolean> => {
      return new Promise((res) => {
        if (!context.session || !context.session.userId) {
          throw new Error('No active sesssion or session information provided.');
        }
        context.session.destroy((err) => {
          if (err) console.log('LOGOUT ERROR:', err);
          res(true);
        });
      });
    },
    logoutAll: async (
      // eslint-disable-next-line
      _: any,
      // eslint-disable-next-line
      __: any,
      context: { redis: Redis; session: Session }
    ): Promise<boolean> => {
      const { userId } = context.session;
      if (!userId) return false;

      const sessionIds = await context.redis.lrange(`${USER_SESSION_ID_PREFIX}${userId}`, 0, -1);

      await sessionIds.reduce(async (promise, id) => {
        await promise;
        await redis.del(`${REDIS_SESSION_PREFIX}${id}`);
      }, Promise.resolve());

      return true;
    },
  },
};
