// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const warning = (type: string, data: any): void => {
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
