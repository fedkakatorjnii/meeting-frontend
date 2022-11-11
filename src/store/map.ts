import OLView from 'ol/View';
import OLMap from 'ol/Map';
import OLTileLayer from 'ol/layer/Tile';
import OLVectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import OLVectorSource from 'ol/source/Vector';
import { Coordinate as olCoordinate } from 'ol/coordinate';
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
  when,
} from 'mobx';
import { Extent } from 'ol/extent';
import * as olProj from 'ol/proj';
import OLFeature from 'ol/Feature';
import OLPointGeom from 'ol/geom/Point';

import { GeolocationStore } from './geolocation-store';

interface MapConfig {
  srid: string;
  center: GeoJSON.Position;
  zoom: number;
  enableRotation: boolean;
}
type PartialMapConfig = Partial<MapConfig>;

// TODO вынести в другой модуль и доставать из localStorage
const getInitialMapConfig = (config: PartialMapConfig): MapConfig => {
  const srid = 'EPSG:3857';
  // const srid = 'EPSG:4326';
  const center = [0, 0];
  const zoom = 14;
  const enableRotation = false;

  return {
    srid,
    center,
    zoom,
    enableRotation,
    ...config,
  };
};

export class MapStore {
  readonly #geolocationStore: GeolocationStore;
  readonly map: OLMap;
  readonly view: OLView;

  @observable
  private _zoom: number;
  @observable
  private _center?: olCoordinate;
  @observable
  private _target?: string | HTMLElement;

  #currentPosition: OLFeature;
  #mainLayer: OLVectorLayer<OLVectorSource>;

  constructor(geolocationStore: GeolocationStore, config: PartialMapConfig) {
    const { center, enableRotation, srid, zoom } = getInitialMapConfig(config);
    const projection = olProj.get(srid) || undefined;

    this.#geolocationStore = geolocationStore;
    this.#currentPosition = new OLFeature<OLPointGeom>();
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

    this.map.addLayer(
      new OLTileLayer({
        source: new OSM(),
      }),
    );

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

    reaction(
      () => this.#geolocationStore.currentPosition.value,
      (value) => {
        if (!value) return;

        const source = this.#mainLayer.getSource();

        if (!source) return;

        const currentPosition = olProj.transform(
          [value.coords.longitude, value.coords.latitude],
          'EPSG:4326',
          this.view.getProjection(),
        );
        const feature = new OLFeature<OLPointGeom>({
          geometry: new OLPointGeom(currentPosition),
        });

        source.clear();
        source.addFeature(feature);
      },
    );
    when(
      () => {
        return this.#geolocationStore.currentPosition.value !== undefined;
      },
      () => {
        if (!this.#geolocationStore.currentPosition.value) return;

        const { coords } = this.#geolocationStore.currentPosition.value;
        const currentPosition = olProj.transform(
          [coords.longitude, coords.latitude],
          'EPSG:4326',
          this.view.getProjection(),
        );
        this.view.setCenter(currentPosition);
      },
    );
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
}
