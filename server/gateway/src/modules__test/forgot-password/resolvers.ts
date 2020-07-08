import { ResolverMap, Context } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { createForgotPasswordEmailLink } from '../../utils/create-link';
import { forgotPasswordLockAccount } from '../../utils/forgot-password-lock-account';

export const resolvers: ResolverMap = {
  Mutation: {
    _verifyForgotPasswordKeyCreation: async (
      _: unknown,
      { email }: GQL.IVerifyForgotPasswordKeyCreationOnMutationArguments,
      { redis }: Context
    ): Promise<string | null> => {
      const user = await User.findOne({ where: { email } });
      if (!user) return null;
      await forgotPasswordLockAccount(user.id, redis);
      const key = await createForgotPasswordEmailLink(user.id, redis);
      return key;
    },
  },
};
