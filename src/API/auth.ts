import axios, { AxiosInstance } from 'axios';
import { getAxiosInstance } from './axiosInstance';

interface APITokens {
  access_token: string;
  refresh_token: string;
}

export class Auth {
  #instance: AxiosInstance;
  #refreshTokens: string | undefined;
  #accessTokens: string | undefined;
  #lifetime: number;
  #lastRefresh = Date.now();

  constructor(instance = getAxiosInstance(), lifetime = 2400000000000000000) {
    this.#instance = instance;
    this.#lifetime = lifetime;
    instance;
  }

  get authorization() {
    if (!this.#accessTokens) return;

    return `Bearer ${this.#accessTokens}`;
  }

  async login(username: string, password: string) {
    try {
      const {
        data: { access_token: access, refresh_token: refresh },
      } = await this.#instance.post<APITokens>('/auth/token', {
        username,
        password,
      });

      this.#accessTokens = access;
      this.#refreshTokens = refresh;
      this.#lastRefresh = Date.now();
    } catch (error) {
      throw new Error('Ошибка авторизации.');
    }
  }

  async getAuthorization() {
    const currentDate = Date.now();
    const time = currentDate - this.#lastRefresh;

    if (!this.#accessTokens || time >= this.#lifetime) {
      await this.#refresh();
    }

    if (!this.#accessTokens) return;

    return `Bearer ${this.#accessTokens}`;
  }

  async #refresh() {
    try {
      if (!this.#refreshTokens) throw new Error();

      const {
        data: { access_token: access, refresh_token: refresh },
      } = await this.#instance.post<APITokens>('/auth/refresh', {
        refresh: this.#refreshTokens,
      });

      this.#refreshTokens = refresh;
      this.#accessTokens = access;
      this.#lastRefresh = Date.now();
    } catch (error) {
      throw new Error('Ошибка авторизации.');
    }
  }
}

const URL = 'http://localhost:3000';

let instance: Auth | undefined;

export const getAuthInstance = () => {
  if (!instance) {
    instance = new Auth();
  }

  return instance;
};
