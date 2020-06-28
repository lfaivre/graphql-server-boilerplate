import { request } from 'graphql-request';
import { createConnection } from 'typeorm';
import { host } from './constants';
import { User } from '../entity/User';

const email = 'test2@test.com';
const password = 'test';

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

test('register user', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  await createConnection();
  expect(true).toEqual(true);
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
