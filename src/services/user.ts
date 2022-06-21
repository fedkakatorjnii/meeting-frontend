import { APIClient, getAPIClientInstance } from './apiClient';
import { UserCollectionResponse } from './types';

interface Room {
  id: number;
  name: string;
  description: string;
}

export interface UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  ownsRooms: Room[];
  consistsRooms: Room[];
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
}
