import { Collection } from './collection';
import { RoomResponse } from './rooms';

export type UserCollectionResponse = Collection<UserResponse>;

export type UserId = number;
export type Username = string;
export type UserIdRequest = UserId | Username;

export interface UserResponse {
  id: UserId;
  username: Username;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperuser: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownsRooms: Omit<RoomResponse, 'owner'>[];
  consistsRooms: Omit<RoomResponse, 'owner'>[];
}

export type NewUserRequest = Pick<UserResponse, 'username' | 'email'> & {
  password: string;
} & Partial<Pick<UserResponse, 'firstName' | 'lastName'>>;

export type PartialNewUserRequest = Partial<NewUserRequest>;
