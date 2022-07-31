import axios from 'axios';
import { Auth } from './resources';

const URL = process.env.BACKEND_URL;

export const getAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: URL,
    timeout: 24000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });

  // interceptors

  return axiosInstance;
};

export const services = {
  auth: new Auth(getAxiosInstance()),
};

export type Services = typeof services;
