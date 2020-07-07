import { request } from 'graphql-request';
import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import randomize from 'randomatic';
import { host } from '../../../setup';
import { TEST_createAndConfirmUser, login, logout, logoutAll } from './mutations';
import { me } from './queries';

describe('log out user', () => {
  test('a user can log out of one session', async () => {
    const email = `${randomize('Aa0', 4)}@test.com`;
    const password = randomize('*', 4);

    const instance1 = axios.create();
    axiosCookieJarSupport(instance1);
    instance1.defaults.jar = new tough.CookieJar();

    const mutation1 = TEST_createAndConfirmUser(email, password);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ TEST_createAndConfirmUser: null });

    const mutation2 = login(email, password);
    const response2 = await instance1.post(host, { query: mutation2 }, { withCredentials: true });
    expect(response2.data.data.login).toEqual(null);

    const mutation3 = logout();
    const response3 = await instance1.post(host, { query: mutation3 }, { withCredentials: true });
    expect(response3.data.data.logout).toEqual(true);
  });

  test('a user can log out of all sessions', async () => {
    const email = `${randomize('Aa0', 4)}@test.com`;
    const password = randomize('*', 4);

    const instance1 = axios.create();
    axiosCookieJarSupport(instance1);
    instance1.defaults.jar = new tough.CookieJar();

    const instance2 = axios.create();
    axiosCookieJarSupport(instance2);
    instance2.defaults.jar = new tough.CookieJar();

    const mutation1 = TEST_createAndConfirmUser(email, password);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ TEST_createAndConfirmUser: null });

    const mutation2 = login(email, password);
    const response2 = await instance1.post(host, { query: mutation2 }, { withCredentials: true });
    const response3 = await instance2.post(host, { query: mutation2 }, { withCredentials: true });
    expect(response2.data.data.login).toEqual(null);
    expect(response3.data.data.login).toEqual(null);

    const query = me();
    const response4 = await instance1.post(host, { query }, { withCredentials: true });

    const mutation3 = logoutAll();
    const response5 = await instance1.post(host, { query: mutation3 }, { withCredentials: true });
    expect(response5.data.data.logoutAll).toEqual(true);

    const response6 = await instance2.post(host, { query }, { withCredentials: true });
    expect(response4.data.data.me).not.toEqual(response6.data.data.me);
  });
});
