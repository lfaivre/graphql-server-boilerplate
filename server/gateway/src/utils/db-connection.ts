import { getConnectionOptions, createConnection, Connection } from 'typeorm';

// eslint-disable-next-line import/prefer-default-export
export const createTypeORMConnection = async (): Promise<Connection> => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV || 'development');
  return createConnection({ ...connectionOptions, name: 'default' });
};
