import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { warning } from './warnings';
import { DEFAULT_HOST } from '../constants';

// TODO :: Move these initializations to a separate file with an export
const hostExternal = process.env.GATEWAY_DEV_HOST_EXT || DEFAULT_HOST;
if (!process.env.GATEWAY_DEV_HOST_EXT) {
  warning('HOST', { host: DEFAULT_HOST });
}

const host = process.env.GATEWAY_DEV_HOST || 'gateway-dev';
if (!process.env.GATEWAY_DEV_HOST) {
  console.log('NO GATEWAY_DEV_HOST ENVIRONMENT VARIABLE AVAILABLE');
}

const allowed = ['http://localhost:4000', `http://${hostExternal}`, `http://${host}`];
export const corsOptionsDelegate: CorsOptionsDelegate = (req, callback) => {
  let corsOptions: CorsOptions = {
    optionsSuccessStatus: 200,
    credentials: true,
  };
  const origin = req.header('Origin');
  if (!origin) {
    // TODO ;: Need to handle this with a more robust networking setup
    console.log('SETTING CORS TO http://tests');
    corsOptions = { ...corsOptions, origin: 'http://tests' };
  } else if (allowed.indexOf(origin) !== -1) {
    console.log('SETTING CORS TO true');
    corsOptions = { ...corsOptions, origin: true };
  } else {
    callback(new Error('Not allowed by CORS'));
  }
  // console.log('CORS OPTIONS:', corsOptions);
  callback(null, corsOptions);
};
