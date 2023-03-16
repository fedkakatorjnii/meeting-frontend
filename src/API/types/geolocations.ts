import { User } from '@API/user';
import { Point } from 'geojson';

import { Collection } from './collection';

export type GeolocationId = number;
export type GeolocationIdRequest = GeolocationId;

interface GeolocationResponse {
  id: GeolocationId;
  point: Point;
  createdAt: string;
  updatedAt: string | null;
  owner: User;
}

export type GeolocationCollectionResponse = Collection<GeolocationResponse>;
export type Position = [number, number];
