import { ApolloServer } from 'apollo-server';
import { createTypeORMConnection } from './utils/db-connection';
import { schemas } from './merge-schema';
import { warning } from './utils/warnings';
import { DEFAULT_PORT } from './constants';

const port = process.env.PORT || DEFAULT_PORT;
if (!process.env.PORT) {
  warning('PORT', { port: DEFAULT_PORT });
}

export const startServer = async (): Promise<void> => {
  const server = new ApolloServer({ schema: schemas });
  await createTypeORMConnection();
  server.listen({ port }).then(({ url }) => {
    console.log(`Server running at ${url}`);
  });
};
