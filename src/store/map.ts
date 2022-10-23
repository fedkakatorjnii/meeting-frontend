import { computed, makeObservable, observable, runInAction } from 'mobx';
import { Map as olMap, View as olView } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import olTileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import * as olProj from 'ol/proj';

export class MapStore {
  readonly map: olMap;
  private _zoom: number;
  private _center?: Coordinate;
  private _target?: string | HTMLElement;

  constructor(
    srid: string = 'EPSG:3857',
    center: GeoJSON.Position = [40.26694998612129, 48.317516833152155],
    zoom: number = 10,
  ) {
    this.map = new olMap({
      view: new olView({
        center: center,
        zoom: zoom,
        // @ts-ignore
        projection: olProj.get(srid),
      }),
      layers: [
        new olTileLayer({
          source: new OSM(),
          zIndex: 0,
        }),
      ],
      controls: [],
    });

    this._target = this.map.getTarget();
    this._zoom = this.map.getView().getZoom() || 0;
    this._center = this.map.getView().getCenter();

    this.map.on('change:target', this._checkTarget);
    this.map.getView().on('change:center', this._checkCenter);
    this.map.getView().on('change:resolution', this._checkZoom);

    makeObservable<MapStore, '_zoom' | '_target'>(this, {
      _zoom: observable,
      zoom: computed,
      _target: observable,
      target: computed,
    });
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(value: number) {
    this._zoom = value;
  }

  get center() {
    return this._center;
  }

  set center(value: Coordinate | undefined) {
    this._center = value;
  }

  get target() {
    return this._target;
  }

  set target(value: string | HTMLElement | undefined) {
    this._target = value;
  }

  get extent() {
    return this.map.getView().calculateExtent();
  }

  set extent(value: Extent) {
    this.map.getView().fit(value);
  }

  private _checkTarget = () => {
    runInAction(() => (this._target = this.map.getTarget()));
  };

  private _checkZoom = () => {
    runInAction(() => (this._zoom = this.map.getView().getZoom() || 0));
  };

  private _checkCenter = () => {
    runInAction(() => (this._center = this.map.getView().getCenter()));
  };
}
