/* eslint-disable @typescript-eslint/naming-convention */

export const register = (email: string, password: string): string => `
  mutation {
    register(email: "${email}", password: "${password}") {
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

export const TEST_verifyCreateConfirmationLink = (email: string): string => `
  mutation {
    TEST_verifyCreateConfirmationLink(email: "${email}")
  }
`;
