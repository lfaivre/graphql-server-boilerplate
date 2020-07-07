import { TestUser } from '../../types';
import { newUser } from '../../utils/new-user';
import { axiosResponse } from '../../utils/responses';
import { GraphQLMutations as GQLM } from '../../mutations';
import { GraphQLQueries as GQLQ } from '../../queries';
import { axiosInstanceWithCookies } from '../../utils/axios-persisted';

const { stringify } = JSON;

let user1: TestUser;
let user2: TestUser;
let user3: TestUser;

describe('log out user', () => {
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

  test('a user can log out of one session', async () => {
    const { axiosInstance } = user1;

    const result = await axiosResponse(GQLM.logout(), true, true, axiosInstance);
    if (result.updatedInstance) user1.axiosInstance = result.updatedInstance;
    expect(result.response.data.data).toEqual({ logout: true });
  });

  test('generate and log in two users using the same credentials', async () => {
    user2 = await newUser(true, true, false);
    expect(user2.isRegistered).toEqual(true);
    expect(user2.isConfirmed).toEqual(true);
    expect(user2.axiosInstance).toBeUndefined();

    user3 = { ...user2 };

    user2.axiosInstance = axiosInstanceWithCookies();
    user3.axiosInstance = axiosInstanceWithCookies();
    const user2IntialInstance = stringify(user2.axiosInstance.defaults.jar);
    const user3IntialInstance = stringify(user3.axiosInstance.defaults.jar);

    const result1 = await axiosResponse(
      GQLM.login(user2.email, user2.password),
      true,
      true,
      user2.axiosInstance
    );
    const result2 = await axiosResponse(
      GQLM.login(user3.email, user3.password),
      true,
      true,
      user3.axiosInstance
    );

    expect(result1.response.data.data).toEqual({ login: null });
    expect(result2.response.data.data).toEqual({ login: null });

    if (result1.updatedInstance) user2.axiosInstance = result1.updatedInstance;
    if (result2.updatedInstance) user3.axiosInstance = result2.updatedInstance;

    const user2UpdatedInstance = stringify(user2.axiosInstance?.defaults.jar);
    const user3UpdatedInstance = stringify(user3.axiosInstance?.defaults.jar);

    expect(user2UpdatedInstance).not.toEqual(user3UpdatedInstance);
    expect(user2UpdatedInstance).not.toEqual(user2IntialInstance);
    expect(user3UpdatedInstance).not.toEqual(user3IntialInstance);
  });

  test('a user can log out of all sessions', async () => {
    const result1 = await axiosResponse(GQLQ.me(), true, true, user2.axiosInstance);
    const result2 = await axiosResponse(GQLQ.me(), true, true, user3.axiosInstance);

    if (result1.updatedInstance) user2.axiosInstance = result1.updatedInstance;
    if (result2.updatedInstance) user3.axiosInstance = result2.updatedInstance;

    expect(result1.response.data.data.me).toEqual(result2.response.data.data.me);

    const result3 = await axiosResponse(GQLM.logoutAll(), true, true, user2.axiosInstance);
    if (result3.updatedInstance) user2.axiosInstance = result3.updatedInstance;
    expect(result3.response.data.data).toEqual({ logoutAll: true });

    const result4 = await axiosResponse(GQLQ.me(), true, true, user3.axiosInstance);
    if (result4.updatedInstance) user3.axiosInstance = result4.updatedInstance;
    expect(result4.response.data.data).toEqual({ me: null });
  });
});
