import { makeObservable } from 'mobx';

import { socketUrl } from '@common';
import {
  Services,
  getWsInstance,
  AnonMessageToRoom,
  MessageToRoom,
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

    this.#messagesListener();

    makeObservable<MessagesSocketStore>(this, {});
  }

  #getSocket = async () => {
    try {
      const token = await this.#services.auth.getAuthorization();

      // TODO
      if (!token) return;

      return getWsInstance(socketUrl, token);
    } catch (e) {
      // TODO
    }

    return;
  };

  #messagesListener = async () => {
    console.log('#messagesListener');
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

  sendMessage = async (room: number, message: string) => {
    try {
      const socket = await this.#getSocket();

      // TODO
      if (!socket) throw 'Не удалось открыть соединение.';

      const data: AnonMessageToRoom = {
        room,
        message: message.trim(),
      };

      socket.emit('msgToServer', data);
    } catch (e) {
      // TODO
    }
  };
}
