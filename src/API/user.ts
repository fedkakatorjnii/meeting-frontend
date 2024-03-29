import { APIClient, getAPIClientInstance } from './api-client';
import {
  NewUserRequest,
  UserCollectionResponse,
  UserIdRequest,
  UserResponse,
} from './types';

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

  async find(userId: UserIdRequest) {
    const res = await this.#apiClient.get<UserResponse>(
      `${this.#uri}/${userId}`,
    );

    return res.data;
  }

  async delete(userId: UserIdRequest) {
    const res = await this.#apiClient.delete<UserResponse>(
      `${this.#uri}/${userId}`,
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
