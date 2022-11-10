import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { getUserName } from '@common/helpers';
import {
  Services,
  MetaData,
  RoomResponse,
  NewRoomRequest,
  RoomIdRequest,
  RoomId,
} from '@API';
import { NotificationsStore } from './notifications-store';
import { RoomStore, RoomStoreDefaultValue } from './room';
import { AuthStore } from './auth';

interface RoomsStores {
  authStore: AuthStore;
  notificationsStore: NotificationsStore;
}

export class RoomsStore {
  #services: Services;
  #authStore: AuthStore;
  #notificationsStore: NotificationsStore;

  private _currentRoomId: RoomId | undefined = undefined;
  private _rooms: MetaData<RoomStore[]> = {
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

  constructor(
    services: Services,
    { authStore, notificationsStore }: RoomsStores,
  ) {
    this.#services = services;
    this.#authStore = authStore;
    this.#notificationsStore = notificationsStore;

    makeObservable<
      RoomsStore,
      '_rooms' | '_room' | '_currentRoomId' | '_newRoom' | '_deleteRoom'
    >(this, {
      listToRooms: action,
      find: action,
      create: action,
      changeCurrentRoom: action,
      clearCreate: action,
      _rooms: observable,
      _room: observable,
      _currentRoomId: observable,
      _newRoom: observable,
      _deleteRoom: observable,
      rooms: computed,
      room: computed,
      newRoom: computed,
      deleteRoom: computed,
      currentRoomId: computed,
      currentRoom: computed,
    });
  }

  async listToRooms(_page = 1, _page_size = 10) {
    try {
      this._rooms = {
        loading: true,
      };

      const res = await this.#services.messages.listToRooms(_page, _page_size);

      const rooms: RoomStore[] = res.map(({ room, messages }) => {
        const defaultValue: RoomStoreDefaultValue = {
          id: room.id,
          room,
          messages,
        };

        return new RoomStore(
          this.#services,
          {
            authStore: this.#authStore,
            notificationsStore: this.#notificationsStore,
          },
          defaultValue,
        );
      });

      runInAction(() => {
        this._rooms.value = rooms;
      });
    } catch (e) {
      let error = new Error('Ошибка получения списка сообщений.');

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

        const defaultValue: RoomStoreDefaultValue = {
          id: room.id,
          room,
        };

        const roomStore = new RoomStore(
          this.#services,
          {
            authStore: this.#authStore,
            notificationsStore: this.#notificationsStore,
          },
          defaultValue,
        );

        if (this._rooms.value) {
          this._rooms.value.push(roomStore);
        } else {
          this._rooms.value = [roomStore];
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

  async changeCurrentRoom(roomId?: RoomIdRequest) {
    this._currentRoomId = roomId;
  }

  clearCreate() {
    this._newRoom = {
      loading: false,
    };
  }

  get currentRoomId() {
    return this._currentRoomId;
  }

  get currentRoom() {
    return this._rooms.value?.find((room) => room.id === this._currentRoomId);
  }

  get rooms() {
    return this._rooms.value;
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
