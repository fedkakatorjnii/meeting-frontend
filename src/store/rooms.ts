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
  RoomCollectionResponse,
  NewRoomRequest,
  RoomIdRequest,
  RoomId,
} from '@API';
import { NotificationsStore } from './notifications-store';

export class RoomStore {
  #services: Services;
  #notificationsStore: NotificationsStore;
  private _currentRoomId: RoomId | undefined = undefined;

  private _rooms: MetaData<RoomCollectionResponse> = {
    loading: false,
  };
  private _room: MetaData<RoomResponse> = {
    loading: false,
  };

  private _newRoom: MetaData<RoomResponse> = {
    loading: false,
  };

  private _deleteRoom: MetaData<boolean> = {
    loading: false,
  };

  constructor(services: Services, notificationsStore: NotificationsStore) {
    this.#services = services;
    this.#notificationsStore = notificationsStore;

    makeObservable<
      RoomStore,
      '_rooms' | '_room' | '_currentRoomId' | '_newRoom' | '_deleteRoom'
    >(this, {
      list: action,
      find: action,
      create: action,
      delete: action,
      clearCreate: action,
      clearDelete: action,
      _rooms: observable,
      _room: observable,
      _currentRoomId: observable,
      _newRoom: observable,
      _deleteRoom: observable,
      rooms: computed,
      room: computed,
      newRoom: computed,
      deleteRoom: computed,
    });
  }

  async list() {
    try {
      this._rooms = {
        loading: true,
      };

      const res = await this.#services.room.list();

      runInAction(() => {
        this._rooms.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения списка комнат.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._rooms.error = error;
      });
    } finally {
      runInAction(() => {
        this._rooms.loading = false;
      });
    }
  }

  async find(roomId: RoomIdRequest) {
    try {
      runInAction(() => {
        this._room = {
          loading: true,
        };
      });

      const res = await this.#services.room.find(roomId);

      runInAction(() => {
        this._room.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения комнаты.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._room.error = error;
      });
    } finally {
      runInAction(() => {
        this._room.loading = false;
      });
    }
  }

  async create(data: NewRoomRequest) {
    const roomName = data.description || data.name || '';

    try {
      runInAction(() => {
        this._newRoom = {
          loading: true,
        };
      });
      const room = await this.#services.room.create(data);

      runInAction(() => {
        this._newRoom.value = room;
        const msg = `Room ${roomName} has been created!`;

        if (this._rooms.value) {
          this._rooms.value.items.push(room);
        }

        this.#notificationsStore.add({
          msg,
          severity: 'success',
        });
      });
    } catch (e) {
      let error = new Error('Ошибка создания комнаты.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._newRoom.error = error;
      });

      const msg = `${roomName} room create error!`;

      this.#notificationsStore.add({
        msg,
        severity: 'success',
      });
    } finally {
      runInAction(() => {
        this._newRoom.loading = false;
      });
    }
  }

  async delete(roomId: RoomIdRequest) {
    const currentRoom = this._rooms.value?.items.find(
      (room) => room.id === roomId,
    );
    const roomName = currentRoom?.description || currentRoom?.name || '';

    try {
      runInAction(() => {
        this._deleteRoom = {
          loading: true,
        };
      });

      await this.#services.room.delete(roomId);

      runInAction(() => {
        this._deleteRoom.value = true;
        const msg = `Room ${roomName} has been delete!`;

        if (this._rooms.value?.items) {
          this._rooms.value.items = this._rooms.value.items.filter(
            (room) => room.id !== roomId,
          );
        }

        this.#notificationsStore.add({
          msg,
          severity: 'success',
        });
      });
    } catch (e) {
      let error = new Error('Ошибка удаления комнаты.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._deleteRoom.error = error;
        const msg = `${roomName} room delete error!`;

        this.#notificationsStore.add({
          msg,
          severity: 'error',
        });
      });
    } finally {
      runInAction(() => {
        this._deleteRoom.loading = false;
      });
    }
  }

  clearCreate() {
    this._newRoom = {
      loading: false,
    };
  }

  clearDelete() {
    this._deleteRoom = {
      loading: false,
    };
  }

  selectRoom() {}

  get currentRoomId() {
    return this._currentRoomId;
  }

  get rooms() {
    return this._rooms;
  }

  get room() {
    return this._room;
  }

  get newRoom() {
    return this._newRoom;
  }

  get deleteRoom() {
    return this._deleteRoom;
  }
}
