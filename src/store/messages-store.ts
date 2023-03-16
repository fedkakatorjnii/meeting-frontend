import { action, computed, makeObservable, observable } from 'mobx';

import {
  Services,
  MetaData,
  MessageCollectionResponse,
  MessageResponse,
  MessageIdRequest,
  MessageId,
} from '@API';
import { NotificationsStore } from './notifications-store';
import { AuthStore } from './auth';
import { getFullUserName } from '@common/helpers';

interface MessagesStores {
  authStore: AuthStore;
  notificationsStore: NotificationsStore;
}

export class MessagesStore {
  readonly #services: Services;
  readonly #authStore: AuthStore;
  readonly #notificationsStore: NotificationsStore;

  private _currentMessageId: MessageIdRequest | undefined = undefined;

  private _messages: MetaData<MessageCollectionResponse> = {
    loading: false,
  };

  private _delete: MetaData<boolean> = {
    loading: false,
  };

  constructor(
    services: Services,
    { authStore, notificationsStore }: MessagesStores,
    messages?: MessageCollectionResponse,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#notificationsStore = notificationsStore;

    this._messages.value = messages;

    makeObservable<
      MessagesStore,
      '_delete' | '_messages' | '_currentMessageId'
    >(this, {
      _delete: observable,
      _messages: observable,
      _currentMessageId: observable,
      values: computed,
      deleteValue: computed,
      news: computed,
      init: action,
      load: action,
      add: action,
      read: action,
      delete: action,
      clearDelete: action,
      changeCurrentMessage: action,
      isNewMessage: action,
      currentMessageId: computed,
      currentMessage: computed,
    });
  }

  init = (messages: MessageCollectionResponse) => {
    this._messages.value = messages;
  };

  load = () => {
    // TODO
  };

  add = (message: MessageResponse) => {
    const { room, owner } = message;

    if (!this._messages.value) return;

    this._messages.value.items.push(message);
    this._messages.value.total += 1;

    if (owner.id === this.#authStore.authInfo?.userId) return;

    const roomName = room.description || room.name;
    const userName = getFullUserName(message.owner);

    const msg = `You have received a new message from ${userName} in the ${roomName} room!`;

    this.#notificationsStore.add({
      msg,
      severity: 'success',
    });
  };

  read = (readMessages: MessageResponse[]) => {
    if (!this._messages.value) return;

    for (const message of this._messages.value.items) {
      for (const readMessage of readMessages) {
        if (message.id === readMessage.id) {
          message.readers = readMessage.readers;
        }
      }
    }
  };

  delete = (messageId: MessageIdRequest) => {
    if (!this._messages.value) return;

    this._messages.value.items = this._messages.value.items.filter(
      (message) => message.id !== messageId,
    );
    this._messages.value.total -= 1;
  };

  clearDelete = () => {
    this._delete = {
      loading: false,
    };
  };

  get news() {
    if (!this.#authStore.authInfo) return [];

    const { userId } = this.#authStore.authInfo;

    if (!this._messages.value) return [];

    const { items } = this._messages.value;

    return items.filter(
      (message) =>
        message.owner.id !== userId &&
        !message.readers.find((reader) => reader.id === userId),
    );
  }

  get newIds() {
    return this.news.map((message) => message.id);
  }

  isNewMessage(id: MessageId) {
    return !!this.news.find((message) => message.id === id);
  }

  changeCurrentMessage(messageId?: MessageIdRequest) {
    if (this._currentMessageId === messageId) {
      this._currentMessageId = undefined;
    } else {
      this._currentMessageId = messageId;
    }
  }

  get values() {
    return this._messages;
  }

  get deleteValue() {
    return this._delete;
  }

  get currentMessageId() {
    return this._currentMessageId;
  }

  get currentMessage() {
    return this._messages.value?.items.find(
      (item) => item.id === this._currentMessageId,
    );
  }
}
