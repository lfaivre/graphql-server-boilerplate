import { TestUser } from '../../types';
import { newUser } from '../../utils/new-user';
import { axiosResponse } from '../../utils/responses';
import { GraphQLMutations as GQLM } from '../../mutations';
import { GraphQLQueries as GQLQ } from '../../queries';

const { stringify } = JSON;

let user1: TestUser;

describe('retrieve user', () => {
  test('generate and log in first user', async () => {
    user1 = await newUser(true, true, true);
    expect(user1.isRegistered).toEqual(true);
    expect(user1.isConfirmed).toEqual(true);
    expect(user1.axiosInstance).not.toBeUndefined();

    const { email, password, axiosInstance } = user1;
    const intialInstance = stringify(user1.axiosInstance?.defaults.jar);

    const result = await axiosResponse(GQLM.login(email, password), true, true, axiosInstance);
    if (result.updatedInstance) user1.axiosInstance = result.updatedInstance;
    expect(result.response.data.data).toEqual({ login: null });

    const updatedInstance = stringify(user1.axiosInstance?.defaults.jar);
    expect(updatedInstance).not.toEqual(intialInstance);
  });

  test('user can retrieve their information', async () => {
    const result = await axiosResponse(GQLQ.me(), true, true, user1.axiosInstance);
    if (result.updatedInstance) user1.axiosInstance = result.updatedInstance;
    expect(result.response.data.data.me.email).toEqual(user1.email);
  });

  test('an unknown user is unable to retrieve information', async () => {
    const result = await axiosResponse(GQLQ.me(), true, false, user1.axiosInstance);
    if (result.updatedInstance) user1.axiosInstance = result.updatedInstance;
    expect(result.response.data.data).toEqual({ me: null });
  });
});
