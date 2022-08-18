import axios, { AxiosInstance } from 'axios';
import { backendUrl } from '@common';

let instance: AxiosInstance | undefined;

export const getAxiosInstance = (baseURL = backendUrl) => {
  if (!instance) {
    instance = axios.create({ baseURL: backendUrl });
  }

  return instance;
};
