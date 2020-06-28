import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { join } from 'path';
import { createTypeORMConnection } from './utils/db-connection';
import { resolvers } from './resolvers';

const DEFAULT_PORT = 4000;
const port = process.env.PORT || DEFAULT_PORT;
if (!process.env.PORT) {
  console.log(`Port not set using environment variable. Using default port: ${DEFAULT_PORT}.`);
}

const schema = loadSchemaSync(join(__dirname, '/schema/index.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

// eslint-disable-next-line import/prefer-default-export
export const startServer = async (): Promise<void> => {
  const server = new GraphQLServer({ schema: schemaWithResolvers });
  await createTypeORMConnection();
  await server.start({ port });
  console.log(`Server is running on localhost: ${port}`);
};

startServer();
