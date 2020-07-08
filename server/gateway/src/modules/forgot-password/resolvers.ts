import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';
import { ResolverMap, Context } from '../../types/graphql-utils';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import { forgotPasswordLockAccount } from '../../utils/forgot-password-lock-account';
import { User } from '../../entity/User';
import { createForgotPasswordEmailLink } from '../../utils/create-link';
import { FORGOT_PASSWORD_PREFIX } from '../../constants';
import { userPasswordSchema } from '../../yup-schemas';
import { formatYupError } from '../../utils/format-yup-error';

export const userForgotPasswordSchema = yup.object().shape({
  newPassword: userPasswordSchema,
});

export const resolvers: ResolverMap = {
  Mutation: {
    sendForgotPasswordEmail: async (
      _: unknown,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { redis }: Context
    ): Promise<boolean | SchemaError[]> => {
      const user = await User.findOne({ where: { email } });
      if (!user) return [{ path: 'email', message: 'Account not found.' }];

      await forgotPasswordLockAccount(user.id, redis);
      // @todo add frontend url as an arg to function
      await createForgotPasswordEmailLink(user.id, redis);
      // @todo send email
      return true;
    },
    changeForgottenPassword: async (
      _: unknown,
      { newPassword, key }: GQL.IChangeForgottenPasswordOnMutationArguments,
      { redis }: Context
    ): Promise<null | SchemaError[]> => {
      const redisKey = `${FORGOT_PASSWORD_PREFIX}${key}`;
      const userId = await redis.get(redisKey);
      if (!userId) return [{ path: 'key', message: 'Invalid key.' }];

      try {
        await userForgotPasswordSchema.validate({ newPassword }, { abortEarly: false });
      } catch (e) {
        return formatYupError(e);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateUserPromise = User.update(
        { id: userId },
        { password: hashedPassword, forgotPasswordLocked: false }
      );
      const deleteKeyPromise = redis.del(redisKey);

      await Promise.all([updateUserPromise, deleteKeyPromise]);
      return null;
    },
  },
};
