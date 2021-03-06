import { host } from '../../setup';
import { GraphQLMutations as GQLM } from '../mutations';
import { TestUser, RegisterUserResult, RegisterAndConfirmUserResult } from '../types';
import { axiosInstanceWithCookies } from './axios-persisted';
import { randomAlphaNumeric, randomAny } from './random-generators';

const { stringify } = JSON;

export const newEmail = (length?: number): string => {
  const emailLength: number = length || 16;
  return `${randomAlphaNumeric(emailLength)}@test.com`;
};

export const newPassword = (length?: number): string => {
  const passwordLength: number = length || 16;
  return randomAny(passwordLength);
};

const registerUser = async (email: string, password: string): Promise<RegisterUserResult> => {
  const axiosInstance = axiosInstanceWithCookies();
  const mutation = GQLM.register(email, password);
  const response = await axiosInstance.post(host, { query: mutation }, { withCredentials: true });

  if (stringify(response.data.data) !== stringify({ register: null })) {
    throw new Error('Failed to register user.');
  }
  return { isRegistered: true, axiosInstance };
};

const registerAndConfirmUser = async (
  email: string,
  password: string
): Promise<RegisterAndConfirmUserResult> => {
  const axiosInstance = axiosInstanceWithCookies();
  const mutation = GQLM.TEST_createAndConfirmUser(email, password);
  const response = await axiosInstance.post(host, { query: mutation }, { withCredentials: true });

  if (stringify(response.data.data) !== stringify({ TEST_createAndConfirmUser: null })) {
    throw new Error('Failed to register and confirm user.');
  }
  return { isConfirmed: true, axiosInstance };
};

export const newUser = async (
  register: boolean,
  confirm: boolean,
  persistent: boolean
): Promise<TestUser> => {
  const email = newEmail();
  const password = newPassword();
  let isRegistered = false;
  let isConfirmed = false;
  let axiosInstance;

  if (!register && confirm) {
    throw new Error('Invalid parameters. A user is unable to be confirmed if unregistered.');
  } else if (register && !confirm) {
    const result = await registerUser(email, password);
    if (result.isRegistered) {
      isRegistered = true;
      if (persistent) axiosInstance = result.axiosInstance;
    }
  } else if (register && confirm) {
    const result = await registerAndConfirmUser(email, password);
    if (result.isConfirmed) {
      isRegistered = true;
      isConfirmed = true;
      if (persistent) axiosInstance = result.axiosInstance;
    }
  }

  if (persistent && !axiosInstance) {
    axiosInstance = axiosInstanceWithCookies();
  }

  return { email, password, isRegistered, isConfirmed, axiosInstance };
};
