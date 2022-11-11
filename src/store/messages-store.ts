import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import {
  Services,
  MetaData,
  MessageCollectionResponse,
  MessageResponse,
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

    makeObservable<MessagesStore, '_delete' | '_messages'>(this, {
      _delete: observable,
      _messages: observable,
      values: computed,
      deleteValue: computed,
      init: action,
      load: action,
      add: action,
      delete: action,
      clearDelete: action,
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

  delete = (messageId: MessageId) => {
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

  get values() {
    return this._messages;
  }

  get deleteValue() {
    return this._delete;
  }
}
