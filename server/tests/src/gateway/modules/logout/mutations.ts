/* eslint-disable @typescript-eslint/naming-convention */

export const logout = (): string => `
  mutation {
    logout
  }
`;

export const logoutAll = (): string => `
  mutation {
    logoutAll
  }
`;

export const TEST_createAndConfirmUser = (email: string, password: string): string => `
  mutation {
    TEST_createAndConfirmUser(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

export const login = (email: string, password: string): string => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;
