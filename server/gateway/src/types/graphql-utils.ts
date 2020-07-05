/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redis } from 'ioredis';
import { Request } from 'express';

export interface Session {
  userId?: string;
}

export type Resolver = (
  parent: any,
  args: any,
  context: { redis: Redis; session: Session; request: Request },
  info: any
) => any;

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: { redis: Redis; session: Session },
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
