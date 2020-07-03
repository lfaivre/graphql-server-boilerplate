import { generateNamespace } from '@gql2ts/from-schema';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { schemas } from '../utils/merge-schema';

const typescriptTypes = generateNamespace('GQL', schemas);
// writeFile('mySchema.d.ts', typescriptTypes, () => {});
writeFileSync(join(__dirname, '../types/schema.d.ts'), typescriptTypes);
