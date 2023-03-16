import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import {
  Services,
  MetaData,
  RoomId,
  GeolocationCollectionResponse,
} from '@API';
import { NotificationsStore } from './notifications-store';
import { AuthStore } from './auth';

export interface GeolocationsStoreDefaultValue {
  roomId: RoomId;
}

interface GeolocationsStores {
  authStore: AuthStore;
  notificationsStore: NotificationsStore;
}

export class GeolocationsStore {
  readonly #services: Services;
  readonly #authStore: AuthStore;
  readonly #notificationsStore: NotificationsStore;

  readonly #roomId: RoomId;

  private _geolocations: MetaData<GeolocationCollectionResponse> = {
    loading: false,
  };

  constructor(
    services: Services,
    { authStore, notificationsStore }: GeolocationsStores,
    defaultValue: GeolocationsStoreDefaultValue,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#notificationsStore = notificationsStore;

    const { roomId } = defaultValue;

    this.#roomId = roomId;

    makeObservable<GeolocationsStore, '_geolocations'>(this, {
      _geolocations: observable,
      geolocations: computed,
      list: action,
    });
  }

  get geolocations() {
    return this._geolocations;
  }

  async list() {
    try {
      this._geolocations = {
        loading: true,
      };

      const res = await this.#services.geolocations.list(this.#roomId);

      runInAction(() => {
        this._geolocations.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения списка геолокаций.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._geolocations.error = error;
      });
    } finally {
      runInAction(() => {
        this._geolocations.loading = false;
      });
    }
  }
}
