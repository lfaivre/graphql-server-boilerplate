import { ResolverMap, Session } from '../../types/graphql-utils';

export const resolvers: ResolverMap = {
  Mutation: {
    // eslint-disable-next-line
    logout: async (_: any, __: any, context: { session: Session }): Promise<boolean> => {
      return new Promise((res) => {
        context.session.destroy((err) => {
          if (err) console.log('LOGOUT ERROR:', err);
          res(true);
        });
      });
    },
  },
};
