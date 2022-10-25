import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { MetaData, Services, services as apiServices } from '@API';

export class GeolocationStore {
  #services: Services;

  private _currentPosition: MetaData<GeolocationPosition> = {
    loading: false,
  };
  private _positions: MetaData<GeolocationPosition[]> = {
    loading: false,
  };

  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<GeolocationStore, '_currentPosition' | '_positions'>(this, {
      _currentPosition: observable,
      _positions: observable,
      currentPosition: computed,
      positions: computed,
    });

    this._init();
  }

  get currentPosition() {
    return this._currentPosition;
  }

  get positions() {
    return this._positions;
  }

  private _init() {
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
    runInAction(() => {});
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
      },
      (e) => {
        // TODO подумать надо ошибкой
        runInAction(() => {
          this._positions = {
            loading: false,
            error: new Error('Error!'),
          };
        });
      },
      {},
    );
  }
}
