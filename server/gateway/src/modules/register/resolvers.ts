import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';
import { Redis } from 'ioredis';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { formatYupError } from '../../utils/format-yup-error';
import { SchemaError } from '../../../shared/src/gateway/types/module-register-errors';
import { ERRORS } from '../../../shared/src/gateway/constants/module-register-errors';
import { createConfirmEmailLink } from '../../utils/create-link';
import { sendEmail } from '../../utils/send-email';
import { userEmailSchema, userPasswordSchema } from '../../yup-schemas';

export const userRegistrationSchema = yup.object().shape({
  email: userEmailSchema,
  password: userPasswordSchema,
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
        await userRegistrationSchema.validate(args, { abortEarly: false });
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
      await sendEmail(email, link);
      return null;
    },
  },
};
