import { makeObservable } from 'mobx';

import { socketUrl } from '@common';
import {
  Services,
  getWsInstance,
  AnonMessageToRoom,
  MessageToRoom,
  DeleteMessageFromRoom,
  AnonDeleteMessageFromRoom,
  MessageIdRequest,
  RoomId,
  AnonReadMessagesFromRoom,
  ReadMessageFromRoom,
} from '@API';
import { NotificationsStore } from './notifications-store';
import { AuthStore } from './auth';
import { RoomsStore } from './rooms';

interface MessagesSocketStores {
  authStore: AuthStore;
  roomsStore: RoomsStore;
  notificationsStore: NotificationsStore;
}

export class MessagesSocketStore {
  readonly #services: Services;
  readonly #authStore: AuthStore;
  readonly #roomsStore: RoomsStore;
  readonly #notificationsStore: NotificationsStore;

  constructor(
    services: Services,
    { authStore, roomsStore, notificationsStore }: MessagesSocketStores,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#roomsStore = roomsStore;
    this.#notificationsStore = notificationsStore;

    this.#sendMessagesListener();
    this.#readMessagesListener();
    this.#deleteMessagesListener();

    makeObservable<MessagesSocketStore>(this, {});
  }

  #getSocket = async () => {
    try {
      const token = await this.#services.auth.getAuthorization();

      // TODO что делать если не авторизован
      if (!token) return;

      return getWsInstance(socketUrl, token);
    } catch (e) {
      // TODO
    }

    return;
  };

  #readMessagesListener = async () => {
    const socket = await this.#getSocket();

    // TODO
    if (!socket) throw 'Не удалось открыть соединение.';

    socket.on('readMsgToClient', (data: ReadMessageFromRoom) => {
      const room = this.#roomsStore.rooms?.find(
        (room) => room.id === data.room,
      );

      if (room) {
        room.messages.read(data.message);
      }
    });
  };

  #sendMessagesListener = async () => {
    const socket = await this.#getSocket();

    // TODO
    if (!socket) throw 'Не удалось открыть соединение.';

    socket.on('msgToClient', (data: MessageToRoom) => {
      const room = this.#roomsStore.rooms?.find(
        (room) => room.id === data.room,
      );

      if (room) {
        room.messages.add(data.message);
      }
    });
  };

  #deleteMessagesListener = async () => {
    const socket = await this.#getSocket();

    // TODO
    if (!socket) throw 'Не удалось открыть соединение.';

    socket.on('deleteMsgToClient', (data: DeleteMessageFromRoom) => {
      const room = this.#roomsStore.rooms?.find(
        (room) => room.id === data.room,
      );

      if (room) {
        room.messages.delete(data.message);
      }
    });
  };

  deleteMessage = async (room: number, message: number) => {
    try {
      const socket = await this.#getSocket();

      // TODO
      if (!socket) throw 'Не удалось открыть соединение.';

      const data: AnonDeleteMessageFromRoom = {
        room,
        message,
      };

      socket.emit('deleteMsgToServer', data);
    } catch (e) {
      // TODO
    }
  };

  sendMessage = async (room: number, text: string) => {
    const message = text.trim();

    if (!message) return;

    try {
      const socket = await this.#getSocket();

      // TODO
      if (!socket) throw 'Не удалось открыть соединение.';

      const data: AnonMessageToRoom = {
        room,
        message,
      };

      socket.emit('msgToServer', data);
    } catch (e) {
      // TODO
    }
  };

  readMessages = async (roomId: RoomId, messageIds: MessageIdRequest[]) => {
    if (!messageIds.length) return;

    try {
      const socket = await this.#getSocket();

      // TODO
      if (!socket) throw 'Не удалось открыть соединение.';

      const message: AnonReadMessagesFromRoom = {
        room: roomId,
        message: messageIds,
      };

      socket.emit('readMsgToServer', message);
    } catch (e) {
      // TODO
    }
  };
}
