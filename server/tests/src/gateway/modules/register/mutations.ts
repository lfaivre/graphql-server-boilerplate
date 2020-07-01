/* eslint-disable @typescript-eslint/naming-convention */

export const register = (email: string, password: string): string => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

export const TEST_verifySuccessfulRegistration = (email: string, password: string): string => `
  mutation {
    TEST_verifySuccessfulRegistration(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;
