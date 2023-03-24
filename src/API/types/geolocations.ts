import { Point } from 'geojson';

import { Collection } from './collection';
import { UserResponse } from './users';

export type GeolocationId = number;
export type GeolocationIdRequest = GeolocationId;

export interface GeolocationResponse {
  id: GeolocationId;
  point: Point;
  createdAt: string;
  updatedAt: string | null;
  owner: UserResponse;
}

export type GeolocationCollectionResponse = Collection<GeolocationResponse>;
export type Position = [number, number];
