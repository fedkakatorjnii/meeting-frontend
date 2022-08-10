import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Token, TokenResponse } from './models';

const URL = process.env.BACKEND_URL;

export class HttpClient {
  readonly client: AxiosInstance = axios.create({
    baseURL: URL,
    timeout: 24000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  private _token: Token | null = null;
  private _expirationTime: number | null = null;

  constructor() {
    this.client.interceptors.request.use((config: AxiosRequestConfig) => {
      if (this._token && this._token.access) {
        const newConfig: AxiosRequestConfig = {
          ...config,
          headers: {
            Authorization: `Bearer ${this._token.access}`,
          },
        };

        return newConfig;
      }

      return config;
    });

    this.client.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.refreshAccessToken();
        }
      },
    );
  }

  set token(value: Token) {
    this._token = value;
  }

  refreshAccessToken = async () => {
    if (!this.token.refresh) {
      throw new Error('poshel naher');
    }

    const refreshToken = window.localStorage.getItem('refreshToken');
    const token = await this.client.post<TokenResponse>('/auth/refresh', {
      refresh: refreshToken,
    });
    const { access_token, refresh_token } = token.data;
    this.token = {
      access: access_token,
      refresh: refresh_token,
    };
    window.localStorage.setItem('refreshToken', this.token.refresh);
  };
}
