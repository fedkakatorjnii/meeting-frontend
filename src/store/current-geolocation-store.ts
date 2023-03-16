import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import * as olProj from 'ol/proj';
import { Point as OLPoint } from 'ol/geom';
import OLStyle from 'ol/style/Style';
import OLFill from 'ol/style/Fill';
import OLStroke from 'ol/style/Stroke';
import OLCircle from 'ol/style/Circle';

import {
  MetaData,
  Services,
  services as apiServices,
  getWsInstance,
  AnonGeolocationToRoom,
  GeolocationCollectionResponse,
} from '@API';
import { socketUrl } from '@common';
import { NotificationsStore } from './notifications-store';
import { AuthStore } from './auth';
import { RoomsStore } from './rooms';
import { MapStore } from './map';

interface CurrentGeolocationStores {
  authStore: AuthStore;
  mapStore: MapStore;
  roomsStore: RoomsStore;
  notificationsStore: NotificationsStore;
}

const GEOLOCATION_LAYER = 'CURRENT_GEOLOCATION';

const getDefaultCurrentPositionStyle = () => {
  const fill = new OLFill({
    // color: 'rgba(255,255,255,0.4)',
    color: 'rgba(255, 61, 0, 0.4)',
  });
  const stroke = new OLStroke({
    // color: '#3399CC',
    color: '#ff3d00',
    width: 1.25,
  });
  const image = new OLCircle({
    fill: fill,
    stroke: stroke,
    // radius: 5,
    radius: 10,
  });

  const style = new OLStyle({
    image,
    fill,
    stroke,
  });

  return style;
};

export class CurrentGeolocationStore {
  readonly #services: Services;
  readonly #authStore: AuthStore;
  readonly #mapStore: MapStore;
  readonly #roomsStore: RoomsStore;
  readonly #notificationsStore: NotificationsStore;

  private _currentPosition: MetaData<GeolocationPosition> = {
    loading: false,
  };
  private _positions: MetaData<GeolocationPosition[]> = {
    loading: false,
  };
  private _geolocations: MetaData<GeolocationCollectionResponse> = {
    loading: false,
  };

  constructor(
    services = apiServices,
    {
      mapStore,
      authStore,
      roomsStore,
      notificationsStore,
    }: CurrentGeolocationStores,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#mapStore = mapStore;
    this.#roomsStore = roomsStore;
    this.#notificationsStore = notificationsStore;

    makeObservable<
      CurrentGeolocationStore,
      '_currentPosition' | '_positions' | '_geolocations'
    >(this, {
      _currentPosition: observable,
      _positions: observable,
      _geolocations: observable,
      currentPosition: computed,
      positions: computed,
      geolocations: computed,
      goTo: action,
    });
  }

  get currentPosition() {
    return this._currentPosition;
  }

  get positions() {
    return this._positions;
  }

  get geolocations() {
    return this._geolocations;
  }

  init = () => {
    const layer = this.#mapStore.addLayer(GEOLOCATION_LAYER);
    const style = getDefaultCurrentPositionStyle();

    layer.setStyle(style);

    runInAction(() => {
      this._currentPosition = {
        loading: true,
      };
    });

    window.navigator.geolocation.watchPosition(
      (e) => {
        console.log('watchPosition', e);
        const value = this._positions.value
          ? [...this._positions.value, e]
          : [e];
        this.#addCurrentPosition(e);

        runInAction(() => {
          this._positions = {
            loading: false,
            value,
          };
        });
        runInAction(() => {
          this._currentPosition = {
            loading: false,
            value: e,
          };
        });
        this.#sendGeolocationListener(e);

        // TODO подумать стоит ли как-то отображать
        // const msg = "The user's new location is received.";

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

  goTo = () => {
    if (!this._currentPosition.value) return;

    const { latitude, longitude } = this._currentPosition.value.coords;
    const currentPosition = olProj.transform(
      [longitude, latitude],
      'EPSG:4326',
      this.#mapStore.view.getProjection(),
    );

    this.#mapStore.view.fit(new OLPoint(currentPosition), {
      maxZoom: 14,
      duration: 1000,
    });
    // this.#mapStore.view.setCenter(currentPosition);
  };

  #addCurrentPosition = (gp: GeolocationPosition) => {
    const {
      coords: { longitude, latitude },
    } = gp;
    const currentPosition = [longitude, latitude];

    this.#mapStore.clearLayer(GEOLOCATION_LAYER);
    this.#mapStore.addOnLayer(GEOLOCATION_LAYER, currentPosition);
  };

  #getSocket = async () => {
    try {
      const token = await this.#services.auth.getAuthorization();

      // TODO
      if (!token) return;

      return getWsInstance(socketUrl, token);
    } catch (e) {
      // TODO
    }

    return;
  };

  #sendGeolocationListener = async (gl: GeolocationPosition) => {
    const { latitude, longitude } = gl.coords;

    try {
      const socket = await this.#getSocket();

      // TODO
      if (!socket) throw 'Не удалось открыть соединение.';

      const data: AnonGeolocationToRoom = {
        message: [latitude, longitude],
      };

      socket.emit('geolocationToServer', data);
    } catch (e) {
      // TODO
    }
  };
}
