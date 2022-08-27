import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import {
  Services,
  services as apiServices,
  MetaData,
  RoomResponse,
  RoomCollectionResponse,
  NewRoomRequest,
  RoomIdRequest,
} from '@API';

export class RoomStore {
  #services: Services;
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

  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<RoomStore, '_rooms' | '_room'>(this, {
      list: action,
      _rooms: observable,
      _room: observable,
      rooms: computed,
      room: computed,
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
    try {
      runInAction(() => {
        this._newRoom = {
          loading: true,
        };
      });
      const res = await this.#services.room.create(data);

      runInAction(() => {
        this._newRoom.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка создания комнаты.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._newRoom.error = error;
      });
    } finally {
      runInAction(() => {
        this._newRoom.loading = false;
      });
    }
  }

  async delete(roomId: RoomIdRequest) {
    try {
      runInAction(() => {
        this._newRoom = {
          loading: true,
        };
      });
      await this.#services.room.delete(roomId);

      runInAction(() => {
        this._deleteRoom.value = true;
      });
    } catch (e) {
      let error = new Error('Ошибка удаления комнаты.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._deleteRoom.error = error;
      });
    } finally {
      runInAction(() => {
        this._deleteRoom.loading = false;
      });
    }
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
