import { Redis } from 'ioredis';
import { removeAllUserSessions } from './remove-all-user-sessions';
import { User } from '../entity/User';

export const forgotPasswordLockAccount = async (userId: string, redis: Redis): Promise<void> => {
  await User.update({ id: userId }, { forgotPasswordLocked: true });
  await removeAllUserSessions(userId, redis);
};
