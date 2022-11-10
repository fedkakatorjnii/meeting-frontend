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

export interface MessagesCollectionToRoom {
  room: RoomResponse;
  messages: Collection<MessageResponse>;
}

export interface MessagesCollectionToRoomResponse {
  room: RoomResponse;
  messages: MessageCollectionResponse;
}

export type MessagesCollectionToRoomsResponse =
  MessagesCollectionToRoomResponse[];

export interface NewMessageRequest {
  message: string;
  room: RoomIdRequest;
}

export type PartialNewMessageRequest = Partial<NewMessageRequest>;

export interface AnonMessageToRoom {
  room: number;
  message: string;
}

export interface MessageToRoom {
  senderId: number;
  room: number;
  message: MessageResponse;
}
