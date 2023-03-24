import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';
import OLMap from 'ol/Map';
import OLView from 'ol/View';
import OLTileLayer from 'ol/layer/Tile';
import OLVectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import OLVectorSource from 'ol/source/Vector';
import OLStyle from 'ol/style/Style';
import { Coordinate, Coordinate as olCoordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import * as olProj from 'ol/proj';
import OLFeature from 'ol/Feature';
import OLPointGeom from 'ol/geom/Point';
import OLLineString from 'ol/geom/LineString';

import { AnonGeolocationToRoom, getWsInstance, Services } from '@API';
import { socketUrl } from '@common';

interface MapConfig {
  srid: string;
  center: GeoJSON.Position;
  zoom: number;
  enableRotation: boolean;
}
type PartialMapConfig = Partial<MapConfig>;

const DEFAULT_CENTER = [39.70963949629932, 47.22184649681219];

// TODO вынести в другой модуль и доставать из localStorage
const getInitialMapConfig = (config: PartialMapConfig): MapConfig => {
  const srid = 'EPSG:3857';
  const zoom = 14;
  const enableRotation = false;

  const projection = olProj.get(srid) || undefined;
  const center = olProj.transform(DEFAULT_CENTER, 'EPSG:4326', projection);

  return {
    srid,
    center,
    zoom,
    enableRotation,
    ...config,
  };
};

export class MapStore {
  readonly #services: Services;
  readonly map: OLMap;
  readonly view: OLView;

  @observable
  private _zoom: number;
  @observable
  private _center?: olCoordinate = DEFAULT_CENTER;
  @observable
  private _target?: string | HTMLElement;

  #mainLayer: OLVectorLayer<OLVectorSource>;
  #backgroundLayer: OLTileLayer<OSM>;

  #layers: Record<string, OLVectorLayer<OLVectorSource>> = {};

  constructor(services: Services, config: PartialMapConfig) {
    this.#services = services;
    const { center, enableRotation, srid, zoom } = getInitialMapConfig(config);
    const projection = olProj.get(srid) || undefined;

    this.view = new OLView({
      center,
      zoom,
      projection,
      enableRotation,
    });
    this.map = new OLMap({
      view: this.view,
      controls: [],
    });
    this.#mainLayer = new OLVectorLayer({
      source: new OLVectorSource(),
    });
    this.#backgroundLayer = new OLTileLayer({
      source: new OSM(),
    });

    this.map.addLayer(this.#backgroundLayer);
    this.map.addLayer(this.#mainLayer);

    this._target = this.map.getTarget();
    this._zoom = this.map.getView().getZoom() || 0;
    this._center = this.map.getView().getCenter();

    this.map.on('change:target', this._checkTarget);
    this.map.getView().on('change:center', this._checkCenter);
    this.map.getView().on('change:resolution', this._checkZoom);

    this.map.on('click', (e) => {
      const coords = olProj.transform(
        e.coordinate,
        e.map.getView().getProjection(),
        'EPSG:4326',
      );
      console.log('coords', coords);
    });

    makeObservable<MapStore>(this);
  }

  @computed
  get target() {
    return this._target;
  }

  set target(value: string | HTMLElement | undefined) {
    this.map.setTarget(value);
  }

  @computed
  get center() {
    return this._center;
  }

  set center(value: olCoordinate | undefined) {
    this.map.getView().setCenter(value);
  }

  @computed
  get zoom() {
    return this._zoom;
  }

  set zoom(value: number) {
    this.map.getView().setZoom(value);
  }

  get extent() {
    return this.map.getView().calculateExtent();
  }

  set extent(value: Extent) {
    this.map.getView().fit(value);
  }

  @action
  private _checkTarget = () => {
    runInAction(() => (this._target = this.map.getTarget()));
  };

  @action
  private _checkZoom = () => {
    runInAction(() => (this._zoom = this.map.getView().getZoom() || 0));
  };

  @action
  private _checkCenter = () => {
    runInAction(() => (this._center = this.map.getView().getCenter()));
  };

  @action
  addLayer = (
    name: string,
    options?: { style?: OLStyle },
  ): OLVectorLayer<OLVectorSource> => {
    if (this.#layers[name]) return this.#layers[name];

    const layer = new OLVectorLayer({
      source: new OLVectorSource(),
      className: name,
      style: options?.style,
    });

    this.#layers[name] = layer;
    this.map.addLayer(layer);

    return layer;
  };

  @action
  removeLayer = (name: string) => {
    const layer = this.#layers[name];

    if (!layer) return;

    this.map.removeLayer(layer);

    delete this.#layers[name];
  };

  @action
  addPointOnLayer = (name: string, coords: Coordinate) => {
    const source = this.#layers[name]?.getSource();

    if (!source) return;

    const currentPosition = olProj.transform(
      coords,
      'EPSG:4326',
      this.view.getProjection(),
    );
    const geom = new OLPointGeom(currentPosition);
    const feature = new OLFeature(geom);

    source?.addFeature(feature);
  };

  @action
  addLineOnLayer = (name: string, coords: Coordinate[]) => {
    const source = this.#layers[name]?.getSource();

    if (!source) return;

    const currentCoords = coords.map((item) =>
      olProj.transform(item, 'EPSG:4326', this.view.getProjection()),
    );
    const geom = new OLLineString(currentCoords);
    const feature = new OLFeature(geom);

    source?.addFeature(feature);
  };

  @action
  clearLayer(name: string) {
    this.#layers[name]?.getSource()?.clear();
  }

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

  /**
   * Служебный метод для отправки координат.
   */
  #send = async ([longitude, latitude]: Coordinate) => {
    const socket = await this.#getSocket();
    const data: AnonGeolocationToRoom = {
      message: [latitude, longitude],
    };

    // TODO
    if (!socket) throw 'Не удалось открыть соединение.';

    socket.emit('geolocationToServer', data);
  };
}
