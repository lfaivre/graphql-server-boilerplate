import { ResolverMap, Session } from '../../types/graphql-utils';

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
  },
};
