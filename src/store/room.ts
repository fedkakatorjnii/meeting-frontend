import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import {
  Services,
  MetaData,
  RoomResponse,
  RoomId,
  MessageCollectionResponse,
  MessageResponse,
} from '@API';
import { NotificationsStore } from './notifications-store';
import { getFullUserName } from '@common/helpers';
import { AuthStore } from './auth';

export interface RoomStoreDefaultValue {
  id: RoomId;
  room?: RoomResponse;
  messages?: MessageCollectionResponse;
}

interface RoomStores {
  authStore: AuthStore;
  notificationsStore: NotificationsStore;
}

export class RoomStore {
  readonly id: RoomId;

  #services: Services;
  #authStore: AuthStore;
  #notificationsStore: NotificationsStore;

  private _room: MetaData<RoomResponse> = {
    loading: false,
  };

  private _messages: MetaData<MessageCollectionResponse> = {
    loading: false,
  };

  private _delete: MetaData<boolean> = {
    loading: false,
  };

  constructor(
    services: Services,
    { authStore, notificationsStore }: RoomStores,
    defaultValue: RoomStoreDefaultValue,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#notificationsStore = notificationsStore;

    const { id, room, messages } = defaultValue;

    this.id = id;

    makeObservable<RoomStore, '_room' | '_delete' | '_messages'>(this, {
      _room: observable,
      _delete: observable,
      _messages: observable,
      value: computed,
      messages: computed,
      deleteValue: computed,
      load: action,
      addMessage: action,
      delete: action,
      clearDelete: action,
    });

    runInAction(() => {
      this._room.value = room;
      this._messages.value = messages;
    });
  }

  async load() {
    try {
      runInAction(() => {
        this._room = {
          loading: true,
        };
      });

      const res = await this.#services.room.find(this.id);

      runInAction(() => {
        this._room.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения комнаты.');

      if (e instanceof Error) {
        error = e;
      }

      const msg = `Error loading room ${this.name}`;

      runInAction(() => {
        this._room.error = error;
      });

      this.#notificationsStore.add({
        msg,
        severity: 'success',
      });
    } finally {
      runInAction(() => {
        this._room.loading = false;
      });
    }
  }

  async delete() {
    try {
      runInAction(() => {
        this._delete = {
          loading: true,
        };
      });

      await this.#services.room.delete(this.id);

      runInAction(() => {
        const msg = `Room ${this.name} has been delete!`;

        this._delete.value = true;

        this._room.value = undefined;
        this.#notificationsStore.add({
          msg,
          severity: 'success',
        });
      });
    } catch (e) {
      const msg = `${this.name} room delete error!`;
      let error = new Error(msg);

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._delete.error = error;
        this.#notificationsStore.add({
          msg,
          severity: 'error',
        });
      });
    } finally {
      runInAction(() => {
        this._delete.loading = false;
      });
    }
  }

  get value() {
    return this._room;
  }

  get deleteValue() {
    return this._delete;
  }

  clearDelete() {
    this._delete = {
      loading: false,
    };
  }

  addMessage = (message: MessageResponse) => {
    if (!this._messages.value) return;

    this._messages.value.items.push(message);
    this._messages.value.total += 1;

    if (message.owner.id === this.#authStore.authInfo?.userId) return;

    const userName = getFullUserName(message.owner);
    const msg = `You have received a new message from ${userName} in the ${this.name} room!`;

    this.#notificationsStore.add({
      msg,
      severity: 'success',
    });
  };

  get messages() {
    return this._messages;
  }

  get name() {
    if (!this._room.value) return this.id;

    const { description, name } = this._room.value;

    return description || name;
  }
}
