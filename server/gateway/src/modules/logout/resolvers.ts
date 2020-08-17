import { Redis } from 'ioredis';
import { ResolverMap, Session } from '../../types/graphql-utils';
import { removeAllUserSessions } from '../../utils/remove-all-user-sessions';

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
      await removeAllUserSessions(userId, context.redis);
      context.session.destroy((err) => {
        if (err) {
          console.log('ERROR DESTROYING SESSION');
        }
      });

      return true;
    },
  },
};
