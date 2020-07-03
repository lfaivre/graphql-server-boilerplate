import { Redis } from 'ioredis';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import { ERRORS } from '../../../shared/src/gateway/constants/module-register-errors';

import { createConfirmEmailLink } from '../../utils/confirmation';

export const resolvers: ResolverMap = {
  Mutation: {
    TEST_verifySuccessfulRegistration: async (
      // eslint-disable-next-line
      _: any,
      // eslint-disable-next-line
      { email, password }: any
    ): Promise<null | SchemaError[]> => {
      const users = await User.find({ where: { email } });
      if (users.length !== 1) {
        return [ERRORS.EMAIL_MULTIPLE_USERS];
      }
      const user = users[0];
      if (user.email !== email) {
        return [ERRORS.EMAIL_FAILED_SAVE];
      }
      if (user.password !== password && user.password === null) {
        return [ERRORS.PASSWORD_FAILED_SAVE];
      }
      if (user.password === password) {
        return [ERRORS.PASSWORD_FAILED_HASH];
      }
      return null;
    },
    TEST_verifyCreateConfirmationLink: async (
      // eslint-disable-next-line
      _: any,
      // eslint-disable-next-line
      { email }: any,
      context: { redis: Redis }
    ): Promise<string | null> => {
      const user = await User.findOne({
        where: { email },
        select: ['id'],
      });
      if (!user) {
        return null;
      }
      const link = await createConfirmEmailLink(user.id, context.redis, true);
      return link;
    },
    TEST_verifyUserConfirmed: async (
      // eslint-disable-next-line
      _: any,
      // eslint-disable-next-line
      { email }: any
    ): Promise<boolean | null> => {
      const user = await User.findOne({ where: { email }, select: ['confirmed'] });
      if (!user) {
        return null;
      }
      return user.confirmed;
    },
    TEST_verifyUserIDRemovedFromRedis: async (
      // eslint-disable-next-line
      _: any,
      // eslint-disable-next-line
      { id }: any,
      context: { redis: Redis }
    ): Promise<boolean> => {
      const value = await context.redis.get(id);
      return value === null;
    },
  },
};
