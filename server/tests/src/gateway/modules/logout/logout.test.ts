import { request } from 'graphql-request';
import randomize from 'randomatic';
import { host } from '../../../setup';
import { TEST_createAndConfirmUser, login, logout } from './mutations';

const email = `${randomize('Aa0', 4)}@test.com`;
const password = randomize('*', 4);

describe('log out user', () => {
  test('user can successfully logout', async () => {
    const mutation1 = TEST_createAndConfirmUser(email, password);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ TEST_createAndConfirmUser: null });

    const mutation2 = login(email, password);
    const response2 = await request(host, mutation2);
    expect(response2).toEqual({ login: null });

    const mutation3 = logout();
    const response3 = await request(host, mutation3);
    expect(response3).toEqual({ logout: true });
  });
});
