import { readdirSync } from 'fs';
import { join } from 'path';
import { GraphQLSchema } from 'graphql';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeSchemas } from '@graphql-tools/merge';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

const schemasArray: GraphQLSchema[] = [];

const folders = readdirSync(join(__dirname, './modules'));
folders.forEach((folder) => {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
  const resolversArray = loadFilesSync(join(__dirname, `./modules/${folder}/resolvers.*`), {
    extensions: ['.ts', '.js'],
  });
  const resolvers = mergeResolvers(resolversArray);
  const schema = loadSchemaSync(join(__dirname, `./modules/${folder}/schema.graphql`), {
    loaders: [new GraphQLFileLoader()],
  });
  schemasArray.push(addResolversToSchema({ schema, resolvers }));
});

export const schemas = mergeSchemas({ schemas: schemasArray });
