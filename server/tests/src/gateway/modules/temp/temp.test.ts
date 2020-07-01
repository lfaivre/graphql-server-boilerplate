import { request } from 'graphql-request';
import { host } from '../../../setup';
import { hello } from './queries';

test('temporary query resolves', async () => {
  const name = 'test';
  const query = hello(name);
  const response = await request(host, query);
  expect(response).toEqual({ hello: `Hello ${name}` });
});
