import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { createTypeORMConnection } from './utils/db-connection';
import { redis } from './redis';
import { schemas } from './utils/merge-schema';
import { warning } from './utils/warnings';
import { DEFAULT_HOST, DEFAULT_PORT } from './constants';
import { confirmEmail } from './routes/confirm-email';

// TODO :: Pull host and port data from environment variables
const host = process.env.GATEWAY_DEV_HOST || DEFAULT_HOST;
if (!process.env.GATEWAY_DEV_HOST) {
  warning('HOST', { host: DEFAULT_HOST });
}

const port = process.env.GATEWAY_DEV_PORT || DEFAULT_PORT;
if (!process.env.GATEWAY_DEV_PORT) {
  warning('PORT', { port: DEFAULT_PORT });
}

export const startServer = async (): Promise<void> => {
  await createTypeORMConnection();
  const server = new ApolloServer({
    schema: schemas,
    context: { redis },
  });

  const app = express();
  app.use(cors());
  server.applyMiddleware({ app });

  app.get('/confirm/:id', confirmEmail);

  app.listen({ host, port }, () => {
    console.log(`Server running at ${host}:${port}${server.graphqlPath}`);
  });
};
