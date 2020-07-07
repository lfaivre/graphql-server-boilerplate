import { gqlResponse } from '../../utils/responses';
import { GraphQLQueries as GQLQ } from '../../queries';

test('temporary query resolves', async () => {
  const name = 'test';
  const response = await gqlResponse(GQLQ.hello(name));
  expect(response).toEqual({ hello: `Hello ${name}` });
});
