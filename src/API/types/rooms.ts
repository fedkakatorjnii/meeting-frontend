import { Collection } from './collection';
import { UserIdRequest, UserResponse } from './users';

export type RoomCollectionResponse = Collection<RoomResponse>;

export type RoomId = number;
export type RoomIdRequest = RoomId;

export interface RoomResponse {
  id: RoomId;
  name: string;
  description: string;
  photo?: string;
  owner: Omit<UserResponse, 'ownsRooms' | 'consistsRooms'>;
}

export type NewRoomRequest = Omit<RoomResponse, 'id' | 'owner'> & {
  owner: UserIdRequest;
};

export type PartialNewRoomRequest = Partial<NewRoomRequest>;

export type NewAnonRoomRequest = Omit<NewRoomRequest, 'owner'>;

export type PartialNewAnonRoomRequest = Partial<NewAnonRoomRequest>;
