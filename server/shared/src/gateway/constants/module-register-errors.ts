import {
  SchemaError,
  Errors,
  YupSchemaErrors,
  YupSchemaErrorMessages,
  YupSchemaErrorKeys,
} from '../types/module-register-errors';

// General Errors

const EMAIL_TAKEN: SchemaError = {
  path: 'email',
  message: 'The email you are using to register has already been taken.',
};

const EMAIL_MULTIPLE_USERS: SchemaError = {
  path: 'email',
  message: 'Multiple users share the same email used for registration.',
};

const EMAIL_FAILED_SAVE: SchemaError = {
  path: 'email',
  message: 'The email was not saved correctly.',
};

const PASSWORD_FAILED_HASH: SchemaError = {
  path: 'password',
  message: 'The password was not hashed.',
};

const PASSWORD_FAILED_SAVE: SchemaError = {
  path: 'password',
  message: 'The password was not saved correctly.',
};

// Specific to 'yup' Package Schema Validation

const EMAIL_NOT_VALID: SchemaError = {
  path: 'email',
  message: 'The email must be a valid email.',
};

const EMAIL_LENGTH_MIN: SchemaError = {
  path: 'email',
  message: 'The email needs to be at least 3 characters long.',
};

const EMAIL_LENGTH_MAX: SchemaError = {
  path: 'email',
  message: 'The email can be no longer than 255 characters.',
};

const PASSWORD_LENGTH_MIN: SchemaError = {
  path: 'password',
  message: 'The password needs to be at least 3 characters long.',
};

const PASSWORD_LENGTH_MAX: SchemaError = {
  path: 'password',
  message: 'The password can be no longer than 255 characters.',
};

// Exports

export const ERRORS: Errors = {
  EMAIL_TAKEN,
  EMAIL_MULTIPLE_USERS,
  EMAIL_FAILED_SAVE,
  PASSWORD_FAILED_HASH,
  PASSWORD_FAILED_SAVE,
};

export const YUP_SCHEMA_ERRORS: YupSchemaErrors = {
  EMAIL_NOT_VALID,
  EMAIL_LENGTH_MIN,
  EMAIL_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PASSWORD_LENGTH_MAX,
};

export const YUP_ERROR_MESSAGES: YupSchemaErrorMessages = Object.keys(YUP_SCHEMA_ERRORS).reduce(
  (messages, error) => {
    // eslint-disable-next-line no-param-reassign
    messages[error as YupSchemaErrorKeys] = YUP_SCHEMA_ERRORS[error as YupSchemaErrorKeys].message;
    return messages;
  },
  {} as Partial<YupSchemaErrorMessages>
) as YupSchemaErrorMessages;
