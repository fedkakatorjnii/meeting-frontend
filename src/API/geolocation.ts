import { APIClient, getAPIClientInstance } from './api-client';
import { GeolocationCollectionResponse } from './types';

export class Geolocations {
  #apiClient: APIClient;
  #uri = 'geolocations';

  constructor(apiClient: APIClient = getAPIClientInstance()) {
    this.#apiClient = apiClient;
  }

  async list(roomId?: number) {
    const res = await this.#apiClient.get<GeolocationCollectionResponse>(
      `${this.#uri}`,
      {
        params: {
          roomId,
          _page: 0,
          _page_size: 0,
        },
      },
    );

    return res.data;
  }
}
