import { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { Auth, getAuthInstance } from './auth';
import { getAxiosInstance } from './axiosInstance';

type CustomRequestConfig = Omit<AxiosRequestConfig, 'method'>;

export class APIClient {
  #instance: AxiosInstance;
  #auth: Auth;

  constructor(instance = getAxiosInstance(), auth: Auth) {
    this.#instance = instance;
    this.#auth = auth;
  }

  async request<SourceType>(uri: string, options: AxiosRequestConfig = {}) {
    const headers: AxiosRequestHeaders = {
      'Content-Type': 'application/json',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Access-Control-Allow-Origin': '*',
      ...options.headers,
    };
    const url = `/${uri}`;
    const auth = await this.#auth.getAuthorization();

    if (auth) {
      headers.Authorization = auth;
    }

    return this.#instance.request<SourceType>({
      url,
      headers,
      ...options,
    });
  }

  async delete<SourceType>(uri: string, options: CustomRequestConfig = {}) {
    return this.request<SourceType>(uri, {
      ...options,
      method: 'DELETE',
    });
  }

  async patch<SourceType>(uri: string, options: CustomRequestConfig = {}) {
    return this.request<SourceType>(uri, {
      ...options,
      method: 'PATCH',
    });
  }

  async put<SourceType>(uri: string, options: CustomRequestConfig = {}) {
    return this.request<SourceType>(uri, {
      ...options,
      method: 'PUT',
    });
  }

  async post<SourceType>(uri: string, options: CustomRequestConfig = {}) {
    return this.request<SourceType>(uri, {
      ...options,
      method: 'POST',
    });
  }

  async get<SourceType>(uri: string, options: CustomRequestConfig = {}) {
    return this.request<SourceType>(uri, {
      ...options,
      method: 'GET',
    });
  }
}

let instance: APIClient | undefined;

export const getAPIClientInstance = () => {
  if (!instance) {
    instance = new APIClient(getAxiosInstance(), getAuthInstance());
  }

  return instance;
};
