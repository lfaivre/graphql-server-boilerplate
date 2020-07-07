/* eslint-disable @typescript-eslint/naming-convention */

// PRODUCTION

const register = (email: string, password: string): string => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const login = (email: string, password: string): string => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const logout = (): string => `
  mutation {
    logout
  }
`;

const logoutAll = (): string => `
  mutation {
    logoutAll
  }
`;

// TEST

const TEST_verifySuccessfulRegistration = (email: string, password: string): string => `
  mutation {
    TEST_verifySuccessfulRegistration(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const TEST_createAndConfirmUser = (email: string, password: string): string => `
  mutation {
    TEST_createAndConfirmUser(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const TEST_verifyCreateConfirmationLink = (email: string): string => `
  mutation {
    TEST_verifyCreateConfirmationLink(email: "${email}")
  }
`;

const TEST_verifyUserConfirmed = (email: string): string => `
  mutation {
    TEST_verifyUserConfirmed(email: "${email}")
  }
`;

const TEST_verifyUserIDRemovedFromRedis = (id: string): string => `
  mutation {
    TEST_verifyUserIDRemovedFromRedis(id: "${id}")
  }
`;

// EXPORTS

export const GraphQLMutations = {
  register,
  login,
  logout,
  logoutAll,
  TEST_verifySuccessfulRegistration,
  TEST_createAndConfirmUser,
  TEST_verifyCreateConfirmationLink,
  TEST_verifyUserConfirmed,
  TEST_verifyUserIDRemovedFromRedis,
};
