import * as bcrypt from 'bcryptjs';
import { ResolverMap } from './types/graphql-utils';
import { User } from './entity/User';

// eslint-disable-next-line import/prefer-default-export
export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`,
  },
  Mutation: {
    register: async (_: any, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save();
      return true;
    },
  },
};
