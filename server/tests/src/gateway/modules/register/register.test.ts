import { TestUser } from '../../types';
import { newUser, newEmail, newPassword } from '../../utils/new-user';
import { GraphQLMutations as GQLM } from '../../mutations';
import { gqlResponse } from '../../utils/responses';
import {
  ERRORS,
  YUP_ERROR_MESSAGES as YEM,
} from '../../../../shared/src/gateway/constants/module-register-errors';
import { randomAlphaNumeric } from '../../utils/random-generators';

// TODO :: Need to check handling multiple errors: .toEqual({ register: {[{...}, {...}]} })
let user1: TestUser;
let user2: TestUser;
let user3: TestUser;

describe('register user', () => {
  test('generate first user', async () => {
    user1 = await newUser(false, false, false);
    expect(user1.isRegistered).toEqual(false);
    expect(user1.isConfirmed).toEqual(false);
  });

  test('user can be successfully registered', async () => {
    const { email, password } = user1;

    const response1 = await gqlResponse(GQLM.register(email, password));
    expect(response1).toEqual({ register: null });

    const response2 = await gqlResponse(GQLM.TEST_verifySuccessfulRegistration(email, password));
    expect(response2).toEqual({ TEST_verifySuccessfulRegistration: null });
  });

  test('registering another user with the same email returns an error', async () => {
    const { email, password } = user1;

    const response1 = await gqlResponse(GQLM.register(email, password));
    expect(response1).toEqual({ register: [ERRORS.EMAIL_TAKEN] });
  });

  test('generate second user', async () => {
    user2 = await newUser(false, false, false);
    expect(user2.isRegistered).toEqual(false);
    expect(user2.isConfirmed).toEqual(false);
  });

  test('registering with an invalid email returns an error', async () => {
    const invalidEmail1 = randomAlphaNumeric(4);
    user2.email = invalidEmail1;
    const response1 = await gqlResponse(GQLM.register(user2.email, user2.password));
    expect(response1.register[0].message).toEqual(YEM.EMAIL_NOT_VALID);

    const invalidEmail2 = newEmail(256);
    user2.email = invalidEmail2;
    const response2 = await gqlResponse(GQLM.register(user2.email, user2.password));
    expect(response2.register[0].message).toEqual(YEM.EMAIL_LENGTH_MAX);
  });

  test('generate third user', async () => {
    user3 = await newUser(false, false, false);
    expect(user3.isRegistered).toEqual(false);
    expect(user3.isConfirmed).toEqual(false);
  });

  test('registering with an invalid password returns an error', async () => {
    const invalidPassword1 = newPassword(2);
    user3.password = invalidPassword1;
    const response1 = await gqlResponse(GQLM.register(user3.email, user3.password));
    expect(response1.register[0].message).toEqual(YEM.PASSWORD_LENGTH_MIN);

    const invalidPassword2 = newPassword(256);
    user3.password = invalidPassword2;
    const response2 = await gqlResponse(GQLM.register(user3.email, user3.password));
    expect(response2.register[0].message).toEqual(YEM.PASSWORD_LENGTH_MAX);
  });
});
