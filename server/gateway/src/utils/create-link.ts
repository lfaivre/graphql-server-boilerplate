import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { DEFAULT_HOST, DEFAULT_PORT, FORGOT_PASSWORD_PREFIX } from '../constants';
import { warning } from './warnings';

const protocol = 'http';

const host = process.env.GATEWAY_DEV_HOST_EXT || DEFAULT_HOST;
if (!process.env.GATEWAY_DEV_HOST_EXT) {
  warning('HOST', { host: DEFAULT_HOST });
}

const externalHost = process.env.GATEWAY_DEV_HOST || 'gateway-test';

const port = process.env.GATEWAY_DEV_PORT || DEFAULT_PORT;
if (!process.env.GATEWAY_DEV_PORT) {
  warning('PORT', { port: DEFAULT_PORT });
}

export const createConfirmEmailLink = async (
  userId: string,
  redis: Redis,
  test?: boolean
): Promise<string> => {
  const id = uuidv4();
  await redis.set(id, userId, 'ex', 60 * 60 * 24);
  if (test) {
    return `${protocol}://${externalHost}:${port}/confirm/${id}`;
  }
  return `${protocol}://${host}:${port}/confirm/${id}`;
};

export const createForgotPasswordEmailLink = async (
  userId: string,
  redis: Redis,
  test?: boolean
): Promise<string> => {
  const id = uuidv4();
  await redis.set(`${FORGOT_PASSWORD_PREFIX}${id}`, userId, 'ex', 60 * 20);
  if (test) {
    return `${id}`;
  }
  return `${id}`;
};
