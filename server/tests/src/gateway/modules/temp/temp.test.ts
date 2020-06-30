import { request } from 'graphql-request';
import { host } from '../../../setup/constants';

const name = 'test';

const query = `
  {
    hello(name: "${name}")
  }
`;

test('temporary query resolves', async () => {
  const response = await request(host, query);
  expect(response).toEqual({ hello: `Hello ${name}` });
});
