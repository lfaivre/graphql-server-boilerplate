import { request } from 'graphql-request';
import axios from 'axios';
import randomize from 'randomatic';
import { host } from '../../../setup';
import { TEST_createAndConfirmUser, login } from './mutations';
import { me } from './queries';

describe('retrieve user', () => {
  test('user can retrieve their information', async () => {
    const email = `${randomize('Aa0', 4)}@test.com`;
    const password = randomize('*', 4);

    const mutation1 = TEST_createAndConfirmUser(email, password);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ TEST_createAndConfirmUser: null });

    const query1 = login(email, password);
    const response2 = await axios.post(
      host,
      {
        query: query1,
      },
      {
        withCredentials: true,
      }
    );
    expect(response2.data.data.login).toEqual(null);
    console.log('RESPONSE (POST LOGIN)', response2);

    const query2 = me();
    const response3 = await axios.post(
      host,
      {
        query: query2,
      },
      {
        withCredentials: true,
      }
    );
    console.log('RESPONSE (POST ME)', response3);
    console.log('RESPONSE HEADERS (POST ME):', response3.request.res.headers);
    // expect(response3.data.data.me.email).toEqual(email);
  });

  test('an uknown user is unable to retrieve information', async () => {
    expect(true).toEqual(true);
  });
});
