import { Error } from '../../types/errors';

// PRODUCTION AND TEST

// PRODUCTION ONLY

const EMAIL_TAKEN: Error = {
  path: 'email',
  message: 'The email you are using to register has already been taken.',
};

export const ERRORS = {
  EMAIL_TAKEN,
};

// TEST ONLY

const EMAIL_MULTIPLE_USERS: Error = {
  path: 'email',
  message: 'Multiple users share the same email used for registration.',
};

const EMAIL_FAILED_SAVE: Error = {
  path: 'email',
  message: 'The email was not saved correctly.',
};

const PASSWORD_FAILED_HASH: Error = {
  path: 'password',
  message: 'The password was not hashed.',
};

const PASSWORD_FAILED_SAVE: Error = {
  path: 'password',
  message: 'The password was not saved correctly.',
};

export const ERRORS_TEST = {
  EMAIL_MULTIPLE_USERS,
  EMAIL_FAILED_SAVE,
  PASSWORD_FAILED_HASH,
  PASSWORD_FAILED_SAVE,
};
