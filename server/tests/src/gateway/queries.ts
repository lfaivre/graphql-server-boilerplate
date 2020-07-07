/* eslint-disable @typescript-eslint/naming-convention */

// PRODUCTION

export const hello = (name: string): string => `
  {
    hello(name: "${name}")
  }
`;

export const me = (): string => `
  {
    me {
      id
      email
    }
  }
`;

// EXPORTS

export const GraphQLQueries = {
  hello,
  me,
};
