import { APIClient, getAPIClientInstance } from './api-client';
import {
  NewRoomRequest,
  RoomCollectionResponse,
  RoomIdRequest,
  RoomResponse,
} from './types';

export class Room {
  #apiClient: APIClient;
  #uri = 'rooms';

  constructor(apiClient: APIClient = getAPIClientInstance()) {
    this.#apiClient = apiClient;
  }

  async list(_page = 1, _page_size = 10) {
    const res = await this.#apiClient.get<RoomCollectionResponse>(
      `${this.#uri}`,
      {
        params: {
          _page,
          _page_size,
        },
      },
    );

    return res.data;
  }

  async find(userId: RoomIdRequest) {
    const res = await this.#apiClient.get<RoomResponse>(
      `${this.#uri}/${userId}`,
    );

    return res.data;
  }

  async create(data: NewRoomRequest) {
    const res = await this.#apiClient.post<RoomResponse>(`${this.#uri}/`, {
      data,
    });

    return res.data;
  }

  async delete(userId: RoomIdRequest) {
    const res = await this.#apiClient.delete<string>(`${this.#uri}/${userId}`);

    return res.data;
  }
}
