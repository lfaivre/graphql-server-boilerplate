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

export const TEST_verifyCreateConfirmationLink = (email: string): string => `
  mutation {
    TEST_verifyCreateConfirmationLink(email: "${email}")
  }
`;

export const TEST_verifyUserConfirmed = (email: string): string => `
  mutation {
    TEST_verifyUserConfirmed(email: "${email}")
  }
`;

export const TEST_verifyUserIDRemovedFromRedis = (id: string): string => `
  mutation {
    TEST_verifyUserIDRemovedFromRedis(id: "${id}")
  }
`;
