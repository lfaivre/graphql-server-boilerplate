import { Resolver } from '../../types/graphql-utils';

// eslint-disable-next-line
export default async (resolver: Resolver, parent: any, args: any, context: any, info: any) => {
  if (!context.session || !context.session.userId) {
    throw new Error('No cookie provided.');
  }
  const result = await resolver(parent, args, context, info);
  return result;
};
