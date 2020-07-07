/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { request as gqlRequest } from 'graphql-request';
import fetch, { Response } from 'node-fetch';
import { axiosInstanceWithCookies } from './axios-persisted';
import { host } from '../../setup';
import { AxiosResponseResult } from '../types';

export const gqlResponse = async (request: string): Promise<any> => {
  return gqlRequest(host, request);
};

export const nodeFetchResponse = async (request: string): Promise<Response> => {
  return fetch(request);
};

export const axiosResponse = async (
  request: string,
  persistent: boolean,
  withCredentials?: boolean,
  instance?: AxiosInstance
): Promise<AxiosResponseResult> => {
  let axiosInstance: AxiosInstance;
  let response: AxiosResponse;

  if (persistent && instance) {
    axiosInstance = instance;
  } else if (persistent) {
    axiosInstance = axiosInstanceWithCookies();
  }

  if (!persistent) {
    response = await axios.post(host, { query: request });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    response = await axiosInstance!.post(host, { query: request }, { withCredentials });
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { response, updatedInstance: axiosInstance! };
};
