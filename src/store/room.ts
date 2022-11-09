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
  RoomResponse,
  RoomId,
  MessageCollectionResponse,
} from '@API';
import { NotificationsStore } from './notifications-store';

export interface RoomStoreDefaultValue {
  id: RoomId;
  room?: RoomResponse;
  messages?: MessageCollectionResponse;
}

export class RoomStore {
  readonly id: RoomId;

  #services: Services;
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
    notificationsStore: NotificationsStore,
    defaultValue: RoomStoreDefaultValue,
  ) {
    this.#services = services;
    this.#notificationsStore = notificationsStore;

    const { id, room, messages } = defaultValue;
    console.log('defaultValue', defaultValue);

    this.id = id;

    makeObservable<RoomStore, '_room' | '_delete'>(this, {
      _room: observable,
      _delete: observable,
      value: computed,
      deleteValue: computed,
      load: action,
      delete: action,
      clearDelete: action,
    });

    runInAction(() => {
      this._room.value = room;
      this._messages.value = messages;
    });
  }

  #getName() {
    if (!this._room.value) return this.id;

    const { description, name } = this._room.value;

    return description || name;
  }

  async load() {
    const roomName = this.#getName();

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

      const msg = `Error loading room ${roomName}`;

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
    const roomName = this.#getName();

    try {
      runInAction(() => {
        this._delete = {
          loading: true,
        };
      });

      await this.#services.room.delete(this.id);

      runInAction(() => {
        const msg = `Room ${roomName} has been delete!`;

        this._delete.value = true;

        this._room.value = undefined;
        this.#notificationsStore.add({
          msg,
          severity: 'success',
        });
      });
    } catch (e) {
      const msg = `${roomName} room delete error!`;
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

  get messages() {
    return this._messages;
  }
}
