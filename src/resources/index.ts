import axios from 'axios';

const URL = process.env.BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: URL,
  timeout: 24000,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});
