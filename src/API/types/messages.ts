import { Collection } from './collection';
import { RoomResponse } from './rooms';
import { UserResponse } from './users';

export type MessageCollectionResponse = Collection<MessageResponse>;

export interface MessageResponse {
  id: number;
  text: string;
  owner: UserResponse;
  room: RoomResponse;
}

export interface NewMessageRequest {
  //   text: string;
  //   ownerId: number;
  //   roomId: number;
  message: string;
  room: number;
}

export type PartialNewMessageRequest = Partial<NewMessageRequest>;
