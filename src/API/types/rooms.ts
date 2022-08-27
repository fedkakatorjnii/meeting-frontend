import { Collection } from './collection';
import { UserIdRequest, UserResponse } from './users';

export type RoomCollectionResponse = Collection<RoomResponse>;

export type RoomId = number;
export type RoomIdRequest = RoomId;

export interface RoomResponse {
  id: RoomId;
  name: string;
  description: string;
  owner: Omit<UserResponse, 'ownsRooms' | 'consistsRooms'>;
}

export type NewRoomRequest = Pick<RoomResponse, 'id' | 'owner'> & {
  owner: UserIdRequest;
};

export type PartialNewRoomRequest = Partial<NewRoomRequest>;
