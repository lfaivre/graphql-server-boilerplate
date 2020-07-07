import { AxiosInstance, AxiosResponse } from 'axios';

export interface TestUser {
  email: string;
  password: string;
  isRegistered: boolean;
  isConfirmed: boolean;
  axiosInstance?: AxiosInstance;
}

export interface RegisterUserResult {
  isRegistered: boolean;
  axiosInstance: AxiosInstance;
}

export interface RegisterAndConfirmUserResult {
  isConfirmed: boolean;
  axiosInstance: AxiosInstance;
}

export interface AxiosResponseResult {
  response: AxiosResponse;
  updatedInstance: AxiosInstance | undefined;
}
