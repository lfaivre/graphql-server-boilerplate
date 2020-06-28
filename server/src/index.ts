import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { join } from 'path';
import { resolvers } from './resolvers';

const schema = loadSchemaSync(join(__dirname, 'schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

// eslint-disable-next-line import/prefer-default-export
export const startServer = async (): Promise<void> => {
  const server = new GraphQLServer({ schema: schemaWithResolvers });
  await createConnection();
  await server.start();
  console.log('Server is running on localhost:4000');
};

startServer();
