export const warning = (type: string, data: { port?: number }): void => {
  switch (type) {
    case 'PORT': {
      console.log(
        `WARNING: Port the not set using environment variable. Using default port: ${data.port}.`
      );
      break;
    }
    default: {
      break;
    }
  }
};
