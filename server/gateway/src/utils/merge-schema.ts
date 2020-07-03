import { readdirSync } from 'fs';
import { join } from 'path';
import { GraphQLSchema } from 'graphql';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeSchemas } from '@graphql-tools/merge';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

const moduleDirs = ['modules'];
const schemasArray: GraphQLSchema[] = [];

if (process.env.NODE_ENV !== 'production') {
  moduleDirs.push('modules__test');
}

moduleDirs.forEach((moduleDir) => {
  const folders = readdirSync(join(__dirname, `../${moduleDir}`));
  folders.forEach((folder) => {
    // eslint-disable-next-line
    const resolversArray = loadFilesSync(join(__dirname, `../${moduleDir}/${folder}/resolvers.*`), {
      extensions: ['.ts', '.js'],
    });
    const resolvers = mergeResolvers(resolversArray);
    const schema = loadSchemaSync(join(__dirname, `../${moduleDir}/${folder}/schema.graphql`), {
      loaders: [new GraphQLFileLoader()],
    });
    schemasArray.push(addResolversToSchema({ schema, resolvers }));
  });
});

export const schemas = mergeSchemas({ schemas: schemasArray });
