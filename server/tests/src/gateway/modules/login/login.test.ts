import randomize from 'randomatic';
import { gqlResponse } from '../../utils/responses';
import { GraphQLMutations as GQLM } from '../../mutations';
import { newUser } from '../../utils/new-user';
import { TestUser } from '../../types';
import { ERRORS } from '../../../../shared/src/gateway/constants/module-login-errors';

let user1: TestUser;
let user2: TestUser;

describe('log in user', () => {
  test('generate first user', async () => {
    user1 = await newUser(true, true, false);
    expect(user1.isRegistered).toEqual(true);
    expect(user1.isConfirmed).toEqual(true);
  });

  test('user can successfully login', async () => {
    const { email, password } = user1;

    const response = await gqlResponse(GQLM.login(email, password));
    expect(response).toEqual({ login: null });
  });

  test('user is unable to login with incorrect email', async () => {
    const { password } = user1;
    const incorrectEmail = `${randomize('Aa0', 16)}@test.com`;

    const response = await gqlResponse(GQLM.login(incorrectEmail, password));
    expect(response).toEqual({ login: [ERRORS.LOGIN_INVALID] });
  });

  test('user is unable to login with incorrect password', async () => {
    const { email } = user1;
    const incorrectPassword = randomize('*', 16);

    const response = await gqlResponse(GQLM.login(email, incorrectPassword));
    expect(response).toEqual({ login: [ERRORS.LOGIN_INVALID] });
  });

  test('generate second user', async () => {
    user2 = await newUser(true, false, false);
    expect(user2.isRegistered).toEqual(true);
    expect(user2.isConfirmed).toEqual(false);
  });

  test('user is unable to login with an unconfirmed email', async () => {
    const { email, password } = user2;

    const response = await gqlResponse(GQLM.login(email, password));
    expect(response).toEqual({ login: [ERRORS.EMAIL_NOT_CONFIRMED] });
  });
});
