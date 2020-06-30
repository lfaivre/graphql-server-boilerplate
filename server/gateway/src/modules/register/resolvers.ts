import * as bcrypt from 'bcryptjs';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { Error } from '../../types/errors';
import { ERRORS } from '../../errors/modules/register';

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _: any,
      { email, password }: GQL.IRegisterOnMutationArguments
    ): Promise<null | Error[]> => {
      const userAlreadyExists = await User.findOne({ where: { email }, select: ['id'] });
      if (userAlreadyExists) {
        return [ERRORS.EMAIL_TAKEN];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save().catch((e) => {
        console.log(`ERROR SAVING TO DATABSE: ${e}`);
      });
      return null;
    },
  },
};
