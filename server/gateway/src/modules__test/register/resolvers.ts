import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import { ERRORS } from '../../../shared/src/gateway/constants/module-register-errors';

export const resolvers: ResolverMap = {
  Mutation: {
    TEST_verifySuccessfulRegistration: async (
      _: any,
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
  },
};
