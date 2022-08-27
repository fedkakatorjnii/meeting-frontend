import { Collection } from './collection';
import { RoomIdRequest, RoomResponse } from './rooms';
import { UserResponse } from './users';

export type MessageCollectionResponse = Collection<MessageResponse>;

export type MessageId = number;
export type MessageIdRequest = MessageId;

export interface MessageResponse {
  id: MessageId;
  text: string;
  owner: UserResponse;
  room: RoomResponse;
}

export interface NewMessageRequest {
  message: string;
  room: RoomIdRequest;
}

export type PartialNewMessageRequest = Partial<NewMessageRequest>;
