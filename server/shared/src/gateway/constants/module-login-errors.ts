import { SchemaError, Errors } from '../types/module-login-errors';

// General Errors

const LOGIN_INVALID: SchemaError = {
  path: 'email',
  message: 'Invalid login.',
};

const EMAIL_NOT_CONFIRMED: SchemaError = {
  path: 'email',
  message: 'Please confirm your email.',
};

export const ERRORS: Errors = {
  LOGIN_INVALID,
  EMAIL_NOT_CONFIRMED,
};
