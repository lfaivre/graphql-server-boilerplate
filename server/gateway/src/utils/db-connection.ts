import { getConnectionOptions, createConnection, Connection } from 'typeorm';

export const createTypeORMConnection = async (): Promise<Connection> => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV || 'development');
  return createConnection({ ...connectionOptions, name: 'default' });
};
