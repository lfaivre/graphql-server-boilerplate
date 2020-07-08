import * as yup from 'yup';
// @todo make yup error messages shared, not tied to registration
import { YUP_ERROR_MESSAGES as YEM } from '../shared/src/gateway/constants/module-register-errors';

export const userEmailSchema = yup
  .string()
  .email(YEM.EMAIL_NOT_VALID)
  .min(3, YEM.EMAIL_LENGTH_MIN)
  .max(255, YEM.EMAIL_LENGTH_MAX);

export const userPasswordSchema = yup
  .string()
  .min(3, YEM.PASSWORD_LENGTH_MIN)
  .max(255, YEM.PASSWORD_LENGTH_MAX);
