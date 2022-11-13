import { computed, makeObservable, observable, runInAction } from 'mobx';

import { MetaData, Services, services as apiServices } from '@API';
import { NotificationsStore } from './notifications-store';
import { AuthStore } from './auth';
import { RoomsStore } from './rooms';

interface GeolocationStores {
  authStore: AuthStore;
  roomsStore: RoomsStore;
  notificationsStore: NotificationsStore;
}

export class GeolocationStore {
  readonly #services: Services;
  readonly #authStore: AuthStore;
  readonly #roomsStore: RoomsStore;
  readonly #notificationsStore: NotificationsStore;

  private _currentPosition: MetaData<GeolocationPosition> = {
    loading: false,
  };
  private _positions: MetaData<GeolocationPosition[]> = {
    loading: false,
  };

  constructor(
    services = apiServices,
    { authStore, roomsStore, notificationsStore }: GeolocationStores,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#roomsStore = roomsStore;
    this.#notificationsStore = notificationsStore;

    makeObservable<GeolocationStore, '_currentPosition' | '_positions'>(this, {
      _currentPosition: observable,
      _positions: observable,
      currentPosition: computed,
      positions: computed,
    });
  }

  get currentPosition() {
    return this._currentPosition;
  }

  get positions() {
    return this._positions;
  }

  init = () => {
    runInAction(() => {
      this._currentPosition = {
        loading: true,
      };
    });
    window.navigator.geolocation.getCurrentPosition(
      (e) => {
        runInAction(() => {
          this._currentPosition = {
            loading: false,
            value: e,
          };
        });
      },
      (e) => {
        // TODO подумать надо ошибкой
        runInAction(() => {
          this._currentPosition = {
            loading: false,
            error: new Error('Error!'),
          };
        });
      },
      {},
    );

    window.navigator.geolocation.watchPosition(
      (e) => {
        const value = this._positions.value
          ? [...this._positions.value, e]
          : [e];
        runInAction(() => {
          this._positions = {
            loading: false,
            value,
          };
        });

        const msg = "The user's new location is received.";

        // this.#notificationsStore.add({
        //   msg,
        //   severity: 'info',
        // });
      },
      (e) => {
        // TODO подумать надо ошибкой
        runInAction(() => {
          this._positions = {
            loading: false,
            error: new Error('Error!'),
          };
        });

        const msg = 'Error getting user location.';

        this.#notificationsStore.add({
          msg,
          severity: 'error',
        });
      },
      {},
    );
  };
}
