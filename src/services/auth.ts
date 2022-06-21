import axios, { AxiosInstance } from 'axios';

interface APITokens {
  access_token: string;
  refresh_token: string;
}

export class Auth {
  #instance: AxiosInstance;
  #baseURL: string;
  #refreshTokens: string | undefined;
  #accessTokens: string | undefined;
  #lifetime: number;
  #lastRefresh = Date.now();

  constructor(baseURL: string, lifetime = 2400000000000000000) {
    this.#baseURL = baseURL;
    this.#instance = axios.create({ baseURL });
    this.#lifetime = lifetime;
  }

  get #url() {
    return `${this.#baseURL}/api`;
  }

  get authorization() {
    if (!this.#accessTokens) return;

    return `Bearer ${this.#accessTokens}`;
  }

  async login(username: string, password: string) {
    try {
      const {
        data: { access_token: access, refresh_token: refresh },
      } = await this.#instance.post<APITokens>(`${this.#url}/auth/token`, {
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
      } = await this.#instance.post<APITokens>(`${this.#url}/auth/refresh`, {
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
    instance = new Auth(URL);
  }

  return instance;
};
