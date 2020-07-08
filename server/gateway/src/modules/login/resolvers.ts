import * as bcrypt from 'bcryptjs';
import { Redis } from 'ioredis';
import { Request } from 'express';
import { ResolverMap, Session } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import { ERRORS } from '../../../shared/src/gateway/constants/module-login-errors';
import { USER_SESSION_ID_PREFIX } from '../../constants';

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      // eslint-disable-next-line
      _: any,
      args: GQL.ILoginOnMutationArguments,
      context: { redis: Redis; session: Session; request: Request }
    ): Promise<null | SchemaError[]> => {
      const { email, password } = args;
      const user = await User.findOne({ where: { email } });

      if (!user) return [ERRORS.LOGIN_INVALID];
      if (!user.confirmed) return [ERRORS.EMAIL_NOT_CONFIRMED];
      if (user.forgotPasswordLocked)
        return [
          {
            path: 'email',
            message: 'Account is locked.',
          },
        ];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return [ERRORS.LOGIN_INVALID];

      if (context.session && context.request.sessionID) {
        context.session.userId = user.id;
        await context.redis.lpush(`${USER_SESSION_ID_PREFIX}${user.id}`, context.request.sessionID);
      } else {
        console.log('DEBUG :: NO SESSION INFO (LOGIN):', context.session);
      }

      return null;
    },
  },
};
