import { request } from 'graphql-request';
import { host } from '../setup/constants';

const email = 'test@test.com';
const password = 'test';

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test('user can be registered', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
});

test('registered user is in database', async () => {
  // need to implement query and resolver in main
  expect(true).toEqual(true);
});
