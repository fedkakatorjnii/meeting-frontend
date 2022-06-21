import { Collection } from './collection';
import { RoomResponse } from './rooms';

export type UserCollectionResponse = Collection<UserResponse>;

export interface UserResponse {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  ownsRooms: Omit<RoomResponse, 'owner'>[];
  consistsRooms: Omit<RoomResponse, 'owner'>[];
}
