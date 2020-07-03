export type ErrorKeys = 'LOGIN_INVALID' | 'EMAIL_NOT_CONFIRMED';

export interface SchemaError {
  path: string;
  message: string;
}

export type Errors = {
  [key in ErrorKeys]: SchemaError;
};
