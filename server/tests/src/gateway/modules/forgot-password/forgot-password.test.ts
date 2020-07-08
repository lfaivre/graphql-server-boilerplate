/* eslint-disable no-underscore-dangle */

import { gqlResponse } from '../../utils/responses';
import { GraphQLMutations as GQLM } from '../../mutations';
import { newUser, newPassword } from '../../utils/new-user';
import { TestUser } from '../../types';
import { YUP_ERROR_MESSAGES as YEM } from '../../../../shared/src/gateway/constants/module-register-errors';

let user1: TestUser;
let oldPassword: string;
let key: string;

describe('user forgot password', () => {
  test('generate first user', async () => {
    user1 = await newUser(true, true, false);
    oldPassword = user1.password;
    expect(user1.isRegistered).toEqual(true);
    expect(user1.isConfirmed).toEqual(true);
  });

  test('user receives a forgotten password key', async () => {
    const response = await gqlResponse(GQLM._verifyForgotPasswordKeyCreation(user1.email));
    key = response._verifyForgotPasswordKeyCreation;
    expect(key).not.toBeFalsy();
  });

  test('user is unable to log in after receiving a password reset key', async () => {
    const response = await gqlResponse(GQLM.login(user1.email, user1.password));
    expect(response).toEqual({ login: [{ path: 'email', message: 'Account is locked.' }] });
  });

  test('submitting an invalid password returns an error', async () => {
    const invalidPassword1 = newPassword(2);
    const response1 = await gqlResponse(GQLM.changeForgottenPassword(invalidPassword1, key));
    expect(response1.changeForgottenPassword[0].message).toEqual(YEM.PASSWORD_LENGTH_MIN);

    const invalidPassword2 = newPassword(256);
    const response2 = await gqlResponse(GQLM.changeForgottenPassword(invalidPassword2, key));
    expect(response2.changeForgottenPassword[0].message).toEqual(YEM.PASSWORD_LENGTH_MAX);
  });

  test('user is able to change their password', async () => {
    const password = newPassword();
    const response = await gqlResponse(GQLM.changeForgottenPassword(password, key));
    expect(response).toEqual({ changeForgottenPassword: null });
    user1.password = password;
  });

  test('user is able to log in with password', async () => {
    expect(user1.password).not.toEqual(oldPassword);
    const response = await gqlResponse(GQLM.login(user1.email, user1.password));
    expect(response).toEqual({ login: null });
  });
});
