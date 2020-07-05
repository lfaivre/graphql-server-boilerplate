/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any, max-len */
import { GraphQLMiddlewareFunc, Resolver } from '../types/graphql-utils';

export const createMiddleware = (middlewareFunc: GraphQLMiddlewareFunc, resolverFunc: Resolver) => (
  parent: any,
  args: any,
  context: any,
  info: any
) => middlewareFunc(resolverFunc, parent, args, context, info);
