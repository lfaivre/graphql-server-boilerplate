/* eslint-disable */
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IMutation {
    __typename: 'Mutation';
    login: Array<IError> | null;
    register: Array<IError> | null;
    TEST_createAndConfirmUser: Array<IError> | null;
    TEST_verifySuccessfulRegistration: Array<IError> | null;
    TEST_verifyCreateConfirmationLink: string;
    TEST_verifyUserConfirmed: boolean;
    TEST_verifyUserIDRemovedFromRedis: boolean | null;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    email: string;
    password: string;
  }

  interface ITESTCreateAndConfirmUserOnMutationArguments {
    email: string;
    password: string;
  }

  interface ITESTVerifySuccessfulRegistrationOnMutationArguments {
    email: string;
    password: string;
  }

  interface ITESTVerifyCreateConfirmationLinkOnMutationArguments {
    email: string;
  }

  interface ITESTVerifyUserConfirmedOnMutationArguments {
    email: string;
  }

  interface ITESTVerifyUserIDRemovedFromRedisOnMutationArguments {
    id: string;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }

  interface IUser {
    __typename: 'User';
    id: string;
    email: string;
  }

  interface IQuery {
    __typename: 'Query';
    me: IUser | null;
    hello: string;
  }

  interface IHelloOnQueryArguments {
    name?: string | null;
  }
}

/* eslint-enable */
