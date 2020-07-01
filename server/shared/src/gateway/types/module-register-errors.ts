export type ErrorKeys =
  | 'EMAIL_TAKEN'
  | 'EMAIL_MULTIPLE_USERS'
  | 'EMAIL_FAILED_SAVE'
  | 'PASSWORD_FAILED_HASH'
  | 'PASSWORD_FAILED_SAVE';

export type YupSchemaErrorKeys =
  | 'EMAIL_NOT_VALID'
  | 'EMAIL_LENGTH_MIN'
  | 'EMAIL_LENGTH_MAX'
  | 'PASSWORD_LENGTH_MIN'
  | 'PASSWORD_LENGTH_MAX';

export interface SchemaError {
  path: string;
  message: string;
}

export type Errors = {
  [key in ErrorKeys]: SchemaError;
};

export type YupSchemaErrors = {
  [key in YupSchemaErrorKeys]: SchemaError;
};

export type YupSchemaErrorMessages = {
  [key in YupSchemaErrorKeys]: string;
};
