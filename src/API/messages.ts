import { APIClient, getAPIClientInstance } from './api-client';
import {
  MessageCollectionResponse,
  NewUserRequest,
  UserCollectionResponse,
  UserResponse,
} from './types';

export class Messages {
  #apiClient: APIClient;
  #uri = 'messages';

  constructor(apiClient: APIClient = getAPIClientInstance()) {
    this.#apiClient = apiClient;
  }

  async list(roomId: number, ownerId: number, _page = 1, _page_size = 10) {
    const res = await this.#apiClient.get<MessageCollectionResponse>(
      `${this.#uri}`,
      {
        params: {
          roomId,
          ownerId,
          _page,
          _page_size,
        },
      },
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
