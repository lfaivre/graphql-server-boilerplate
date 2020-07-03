import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { Redis } from 'ioredis';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { formatYupError } from '../../utils/format-yup-error';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import {
  ERRORS,
  YUP_ERROR_MESSAGES as YEM,
} from '../../../shared/src/gateway/constants/module-register-errors';
import { createConfirmEmailLink } from '../../utils/confirmation';

const schema = yup.object().shape({
  email: yup
    .string()
    .email(YEM.EMAIL_NOT_VALID)
    .min(3, YEM.EMAIL_LENGTH_MIN)
    .max(255, YEM.EMAIL_LENGTH_MAX),
  password: yup.string().min(3, YEM.PASSWORD_LENGTH_MIN).max(255, YEM.PASSWORD_LENGTH_MAX),
});

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      // eslint-disable-next-line
      _: any,
      args: GQL.IRegisterOnMutationArguments,
      context: { redis: Redis }
    ): Promise<null | SchemaError[]> => {
      const { email, password } = args;
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (e) {
        return formatYupError(e);
      }
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      });
      if (userAlreadyExists) {
        return [ERRORS.EMAIL_TAKEN];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save().catch((e) => {
        // TODO :: Create and return error
        console.log(`ERROR SAVING TO DATABASE: ${e}`);
      });
      const link = await createConfirmEmailLink(user.id, context.redis);
      console.log(`CONFIRMATION LINK CREATED (USER ID: ${user.id}): ${link}`);
      return null;
    },
  },
};
