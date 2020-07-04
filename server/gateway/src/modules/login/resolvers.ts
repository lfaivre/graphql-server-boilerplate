import * as bcrypt from 'bcryptjs';
import { ResolverMap, Session } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import { ERRORS } from '../../../shared/src/gateway/constants/module-login-errors';

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      // eslint-disable-next-line
      _: any,
      args: GQL.ILoginOnMutationArguments,
      context: { session: Session }
    ): Promise<null | SchemaError[]> => {
      const { email, password } = args;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return [ERRORS.LOGIN_INVALID];
      }

      if (!user.confirmed) {
        return [ERRORS.EMAIL_NOT_CONFIRMED];
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return [ERRORS.LOGIN_INVALID];
      }

      if (context.session) {
        context.session.userId = user.id;
      }

      return null;
    },
  },
};
