import axios, { AxiosInstance } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';

export const axiosInstanceWithCookies = (): AxiosInstance => {
  const axiosInstance = axios.create();
  axiosCookieJarSupport(axiosInstance);
  axiosInstance.defaults.jar = new tough.CookieJar();
  return axiosInstance;
};
