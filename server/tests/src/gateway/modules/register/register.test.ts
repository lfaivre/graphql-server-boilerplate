import { request } from 'graphql-request';
import randomize from 'randomatic';
import { host } from '../../../setup';
import { register, TEST_verifySuccessfulRegistration } from './mutations';
import {
  ERRORS,
  YUP_SCHEMA_ERRORS as YEM,
} from '../../../../shared/src/gateway/constants/module-register-errors';

// TODO :: Need to check handling multiple errors: .toEqual({ register: {[{...}, {...}]} })
// TODO :: Move `shared` folder in Dockerfile (only necessary files)

test('user can be successfully registered', async () => {
  const email = 'test@test.com';
  const password = 'test';

  const mutation1 = register(email, password);
  const response1 = await request(host, mutation1);
  expect(response1).toEqual({ register: null });

  const mutation2 = TEST_verifySuccessfulRegistration(email, password);
  const response2 = await request(host, mutation2);
  expect(response2).toEqual({ TEST_verifySuccessfulRegistration: null });
});

test('registering another user with the same email returns an error', async () => {
  const email = 'test2@test.com';
  const password = 'test2';

  const mutation = register(email, password);
  const response = await request(host, mutation);
  expect(response).toEqual({ register: null });
  const response2 = await request(host, mutation);
  expect(response2).toEqual({ register: [ERRORS.EMAIL_TAKEN] });
});

test('registering with an invalid email returns an error', async () => {
  const email1 = 'test';
  const email2 = `${randomize('Aa0', 256)}@test.com`;
  const password = 'test';

  const mutation1 = register(email1, password);
  const response1 = await request(host, mutation1);
  expect(response1).toEqual({ register: [YEM.EMAIL_NOT_VALID] });

  const mutation2 = register(email2, password);
  const response2 = await request(host, mutation2);
  expect(response2).toEqual({ register: [YEM.EMAIL_LENGTH_MAX] });
});

test('registering with an invalid password returns an error', async () => {
  const email = 'test3@test.com';
  const password1 = 'te';
  const password2 = randomize('*', 256);

  const mutation1 = register(email, password1);
  const response1 = await request(host, mutation1);
  expect(response1).toEqual({ register: [YEM.PASSWORD_LENGTH_MIN] });

  const mutation2 = register(email, password2);
  const response2 = await request(host, mutation2);
  expect(response2).toEqual({ register: [YEM.PASSWORD_LENGTH_MAX] });
});
