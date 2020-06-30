import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { Error } from '../../types/errors';
import { ERRORS_TEST } from '../../errors/modules/register';

export const resolvers: ResolverMap = {
  Mutation: {
    TEST_verifySuccessfulRegistration: async (
      _: any,
      { email, password }: any
    ): Promise<null | Error[]> => {
      const users = await User.find({ where: { email } });
      if (users.length !== 1) {
        return [ERRORS_TEST.EMAIL_MULTIPLE_USERS];
      }
      const user = users[0];
      console.log(`USER EMAIL: ${user.email}`);
      console.log(`USER PASSWORD: ${user.password}`);
      if (user.email !== email) {
        return [ERRORS_TEST.EMAIL_FAILED_SAVE];
      }
      if (user.password !== password && user.password === null) {
        return [ERRORS_TEST.PASSWORD_FAILED_SAVE];
      }
      if (user.password === password) {
        return [ERRORS_TEST.PASSWORD_FAILED_HASH];
      }
      return null;
    },
  },
};
