import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import Redis from 'ioredis';
import { createTypeORMConnection } from './utils/db-connection';
import { User } from './entity/User';
import { schemas } from './merge-schema';
import { warning } from './utils/warnings';
import { DEFAULT_HOST, DEFAULT_PORT } from './constants';

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
  const redis = new Redis(6379, 'redis://gateway-redis-dev');
  const server = new ApolloServer({
    schema: schemas,
    context: { redis },
  });

  const app = express();
  app.use(cors());
  // TODO :: Need to remove multiple endpoints ('/' && '/graphql')
  server.applyMiddleware({ app });

  app.get('/confirm/:id', async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      res.send('Email confirmed.');
      // TODO :: Send back response with confirmation email
    } else {
      // TODO :: Create and return error
      res.send('Error confirming email.');
    }
  });

  app.listen({ host, port }, () => {
    console.log(`Server running at ${host}:${port}${server.graphqlPath}`);
  });
};
