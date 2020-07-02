export const warning = (type: string, data: { host?: string; port?: number }): void => {
  switch (type) {
    case 'HOST': {
      console.log(
        `WARNING: The host was not set using an environment variable. Using default host: ${data.host}.`
      );
      break;
    }
    case 'PORT': {
      console.log(
        `WARNING: The port was not set using an environment variable. Using default port: ${data.port}.`
      );
      break;
    }
    default: {
      break;
    }
  }
};
