import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';

type CustomRequestConfig = Omit<AxiosRequestConfig, 'method'>;

interface APITokens {
  access: string;
  refresh: string;
}

export class APIClient {
  #instance: AxiosInstance;
  #baseURL: string;
  #refreshTokens: string | undefined;
  #accessTokens: string | undefined;
  #lifetime: number;
  #lastRefresh = Date.now();

  constructor(baseURL: string, lifetime = 240000) {
    this.#baseURL = baseURL;
    this.#instance = axios.create({ baseURL });
    this.#lifetime = lifetime;
  }

  get #url() {
    return `${this.#baseURL}/api`;
  }

  get #authorization() {
    if (!this.#accessTokens) return;

    return `Bearer ${this.#accessTokens}`;
  }

  async login(username: string, password: string) {
    try {
      const {
        data: { access, refresh },
      } = await this.#instance.post<APITokens>(`${this.#url}/auth/token`, {
        username,
        password,
      });

      this.#refreshTokens = refresh;
      this.#accessTokens = access;
      this.#lastRefresh = Date.now();
    } catch (error) {
      console.log('3');
      throw new Error('Ошибка авторизации.');
    }
  }

  async #refresh() {
    try {
      if (!this.#refresh) throw new Error();

      const {
        data: { access, refresh },
      } = await this.#instance.post<APITokens>(`${this.#url}/auth/refresh`, {
        refresh: this.#refreshTokens,
      });

      this.#refreshTokens = refresh;
      this.#accessTokens = access;
      this.#lastRefresh = Date.now();
    } catch (error) {
      console.log('4');
      throw new Error('Ошибка авторизации.');
    }
  }

  async request<SourceType>(uri: string, options: AxiosRequestConfig = {}) {
    const headers: AxiosRequestHeaders = {
      'Content-Type': 'application/json',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Access-Control-Allow-Origin': '*',
      ...options.headers,
    };
    const url = `${this.#url}/${uri}`;
    const currentDate = Date.now();
    const time = currentDate - this.#lastRefresh;

    if (!this.#authorization || time >= this.#lifetime) {
      await this.#refresh();
    }

    if (this.#authorization) {
      headers.Authorization = this.#authorization;
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

const URL = 'http://localhost:3000';
let instance: APIClient | undefined;

export const getAPIClientInstance = () => {
  if (!instance) {
    instance = new APIClient(URL);
  }

  return instance;
};
