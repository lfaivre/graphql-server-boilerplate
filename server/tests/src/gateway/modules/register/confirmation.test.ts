import { TestUser } from '../../types';
import { newUser } from '../../utils/new-user';
import { GraphQLMutations as GQLM } from '../../mutations';
import { gqlResponse, nodeFetchResponse } from '../../utils/responses';

let user1: TestUser;
let link: string;

describe('confirmation link', () => {
  test('generate first user', async () => {
    user1 = await newUser(true, false, false);
    expect(user1.isRegistered).toEqual(true);
    expect(user1.isConfirmed).toEqual(false);
  });

  test('user receives a confirmation link after registering', async () => {
    const response = await gqlResponse(GQLM.TEST_verifyCreateConfirmationLink(user1.email));
    expect(response).not.toEqual({ TEST_verifyCreateConfirmationLink: null });
    link = response.TEST_verifyCreateConfirmationLink;
  });

  test('confirmation link works', async () => {
    expect(link).not.toBeUndefined();
    const response = await nodeFetchResponse(link);
    const text = await response.text();
    expect(text).toEqual('Email confirmed.');
  });

  test('user is confirmed', async () => {
    const response = await gqlResponse(GQLM.TEST_verifyUserConfirmed(user1.email));
    expect(response).toEqual({ TEST_verifyUserConfirmed: true });
  });

  test('user id is removed from redis', async () => {
    expect(link).not.toBeUndefined();
    const chunks = link.split('/');
    const id = chunks[chunks.length - 1];

    const response = await gqlResponse(GQLM.TEST_verifyUserIDRemovedFromRedis(id));
    expect(response).toEqual({ TEST_verifyUserIDRemovedFromRedis: true });
  });
});
