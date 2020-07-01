import { ValidationError } from 'yup';
import { SchemaError } from '../../shared/src/gateway/types/module-register-errors';

export const formatYupError = (errors: ValidationError): SchemaError[] => {
  const formattedErrors: SchemaError[] = [];
  errors.inner.forEach((error) => {
    formattedErrors.push({
      path: error.path,
      message: error.message,
    });
  });
  return formattedErrors;
};
