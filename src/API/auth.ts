import axios, { AxiosInstance } from 'axios';
import jwtDecode from 'jwt-decode';
import { runInAction } from 'mobx';

import { getAxiosInstance } from './axios-instance';
import { DecodedToken, LoginRequest, UserInfoForToken } from './types';

interface APITokens {
  access: string;
  refresh: string;
}

export class Auth {
  #instance: AxiosInstance;
  #refreshToken: string | undefined;
  #accessToken: string | undefined;
  #lifetime: number;
  #lastRefresh = Date.now();

  constructor(instance = getAxiosInstance(), lifetime = 2400000000000000000) {
    this.#instance = instance;
    this.#lifetime = lifetime;

    const refresh = window.localStorage.getItem('refresh');

    if (refresh) {
      this.#refreshToken = refresh;
    }
  }

  get authorization() {
    if (!this.#accessToken) return;

    return `Bearer ${this.#accessToken}`;
  }

  async login(): Promise<UserInfoForToken>;
  async login(auth: LoginRequest): Promise<UserInfoForToken>;
  async login(auth?: LoginRequest) {
    if (!auth) return this.#refresh();

    const { username, password } = auth;
    try {
      const {
        data: { access, refresh },
      } = await this.#instance.post<APITokens>('/auth/token', {
        username,
        password,
      });
      const decoded: DecodedToken = jwtDecode(access);

      this.#accessToken = access;
      this.#refreshToken = refresh;
      window.localStorage.setItem('refresh', refresh);
      this.#lastRefresh = Date.now();

      return {
        userId: decoded.userId,
        username: decoded.username,
      };
    } catch (error) {
      throw new Error('Ошибка авторизации.');
    }
  }

  logout() {
    this.#refreshToken = undefined;
    this.#accessToken = undefined;
    window.localStorage.removeItem('refresh');
  }

  async getAuthorization() {
    const currentDate = Date.now();
    const time = currentDate - this.#lastRefresh;

    if (!this.#accessToken || time >= this.#lifetime) {
      await this.#refresh();
    }

    if (!this.#accessToken) return;

    return `Bearer ${this.#accessToken}`;
  }

  async #refresh() {
    try {
      if (!this.#refreshToken) throw new Error();

      const {
        data: { access, refresh },
      } = await this.#instance.post<APITokens>('/auth/refresh', {
        refresh: this.#refreshToken,
      });

      this.#refreshToken = refresh;
      this.#accessToken = access;
      window.localStorage.setItem('refresh', refresh);
      this.#lastRefresh = Date.now();

      const decoded: DecodedToken = jwtDecode(access);

      return {
        userId: decoded.userId,
        username: decoded.username,
      };
    } catch (error) {
      throw new Error('Ошибка авторизации.');
    }
  }
}

let instance: Auth | undefined;

export const getAuthInstance = () => {
  if (!instance) {
    instance = new Auth();
  }

  return instance;
};
