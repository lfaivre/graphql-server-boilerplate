export const DEFAULT_HOST = '0.0.0.0';
export const DEFAULT_PORT = 4000;
export const DEFAULT_HOST_REDIS = 'gateway-redis-dev';
export const DEFAULT_PORT_REDIS = 6379;

export const REDIS_SESSION_PREFIX = 'sess:';
export const USER_SESSION_ID_PREFIX = 'userSids:';
export const FORGOT_PASSWORD_PREFIX = 'forgotPassword:';

export const TWITTER_CONSUMER_KEY = (): string => {
  const environmentKey = process.env.TWITTER_CONSUMER_KEY;
  if (!environmentKey) {
    console.log('ERROR: NO TWITTER_CONSUMER_KEY PROVIDED');
    return '';
  }
  return environmentKey;
};

export const TWITTER_CONSUMER_SECRET = (): string => {
  const environmentKey = process.env.TWITTER_CONSUMER_SECRET;
  if (!environmentKey) {
    console.log('ERROR: NO TWITTER_CONSUMER_SECRET PROVIDED');
    return '';
  }
  return environmentKey;
};
