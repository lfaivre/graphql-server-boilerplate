/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */

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

const sendForgotPasswordEmail = (email: string): string => `
  mutation {
    sendForgotPasswordEmail(email: "${email}") {
      path
      message
    }
  }
`;

const changeForgottenPassword = (newPassword: string, key: string): string => `
  mutation {
    changeForgottenPassword(newPassword: "${newPassword}", key: "${key}") {
      path
      message
    }
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

const _verifyForgotPasswordKeyCreation = (email: string): string => `
  mutation {
    _verifyForgotPasswordKeyCreation(email: "${email}")
  }
`;

// EXPORTS

export const GraphQLMutations = {
  register,
  login,
  logout,
  logoutAll,
  sendForgotPasswordEmail,
  changeForgottenPassword,
  TEST_verifySuccessfulRegistration,
  TEST_createAndConfirmUser,
  TEST_verifyCreateConfirmationLink,
  TEST_verifyUserConfirmed,
  TEST_verifyUserIDRemovedFromRedis,
  _verifyForgotPasswordKeyCreation,
};
