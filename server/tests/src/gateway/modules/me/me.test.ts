import { request } from 'graphql-request';
import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import randomize from 'randomatic';
import { host } from '../../../setup';
import { TEST_createAndConfirmUser, login } from './mutations';
import { me } from './queries';

const instance = axios.create();
axiosCookieJarSupport(instance);
instance.defaults.jar = new tough.CookieJar();

const email = `${randomize('Aa0', 4)}@test.com`;
const password = randomize('*', 4);

describe('retrieve user', () => {
  test('user can retrieve their information', async () => {
    const mutation1 = TEST_createAndConfirmUser(email, password);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ TEST_createAndConfirmUser: null });

    const mutation2 = login(email, password);
    const response2 = await instance.post(host, { query: mutation2 }, { withCredentials: true });
    expect(response2.data.data.login).toEqual(null);

    const query = me();
    const response3 = await instance.post(host, { query }, { withCredentials: true });
    expect(response3.data.data.me.email).toEqual(email);
  });

  test('an unknown user is unable to retrieve information', async () => {
    const query = me();
    const response = await instance.post(host, { query }, { withCredentials: false });
    expect(response.data.data.me).toEqual(null);
    // TODO: More robust error checking
    expect(response.data.errors.length).not.toEqual(0);
  });
});
