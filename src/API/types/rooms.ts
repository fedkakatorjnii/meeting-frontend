import { Collection } from './collection';
import { UserResponse } from './users';

export type RoomCollectionResponse = Collection<RoomResponse>;

export interface RoomResponse {
  id: number;
  name: string;
  description: string;
  owner: Omit<UserResponse, 'ownsRooms' | 'consistsRooms'>;
}
