import { ResolverMap } from '../../types/graphql-utils';

export const resolvers: ResolverMap = {
  Query: {
    // eslint-disable-next-line
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments): string => `Hello ${name || 'World'}`,
  },
};
