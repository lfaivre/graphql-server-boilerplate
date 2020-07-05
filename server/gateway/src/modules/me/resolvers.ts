import { ResolverMap, Session } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import middleware from './middleware';
import { createMiddleware } from '../../utils/create-middleware';

export const resolvers: ResolverMap = {
  Query: {
    // eslint-disable-next-line
    me: createMiddleware(middleware, (_: any, __: any, context: { session: Session }) => {
      console.log('SESSION INFO (ME):', context.session);
      return User.findOne({ where: { id: context.session.userId } });
    }),
  },
};
