import { APIClient, getAPIClientInstance } from './apiClient';
import { NewUserRequest, UserCollectionResponse, UserResponse } from './types';

interface Room {
  id: number;
  name: string;
  description: string;
}

export class User {
  #apiClient: APIClient;
  #uri = 'users';

  constructor(apiClient: APIClient = getAPIClientInstance()) {
    this.#apiClient = apiClient;
  }

  async list() {
    const res = await this.#apiClient.get<UserCollectionResponse>(
      `${this.#uri}`,
    );

    return res.data;
  }

  async find(username: string) {
    console.log('axios find', username);
    const res = await this.#apiClient.get<UserResponse>(
      `${this.#uri}/${username}`,
    );

    return res.data;
  }

  async create(data: NewUserRequest) {
    const res = await this.#apiClient.post<UserResponse>(`${this.#uri}/`, {
      data,
    });

    return res.data;
  }
}
