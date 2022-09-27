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
  MessagesCollectionToRoomsResponse,
  RoomId,
  MessagesCollectionToRoomResponse,
} from '@API';

interface MessageDate {
  message: string;
  room: number;
}

export class MessagesStore {
  #services: Services;

  private _currentRoom: MessagesCollectionToRoomResponse | undefined =
    undefined;
  private _messages: MetaData<MessagesCollectionToRoomsResponse> = {
    loading: false,
    value: [],
  };
  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<MessagesStore, '_messages' | '_currentRoom'>(this, {
      send: action,
      listToRooms: action,
      changeCurrentRoom: action,
      _messages: observable,
      _currentRoom: observable,
      messages: computed,
      rooms: computed,
    });
  }

  async listToRooms(_page = 1, _page_size = 10) {
    try {
      this._messages = {
        loading: true,
      };

      const res = await this.#services.messages.listToRooms();

      runInAction(() => {
        this._messages.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения списка сообщений.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._messages.error = error;
      });
    } finally {
      runInAction(() => {
        this._messages.loading = false;
      });
    }
  }

  async send(message: string, roomId: number) {
    // TODO
  }

  changeCurrentRoom(roomId?: RoomId) {
    let room: MessagesCollectionToRoomResponse | undefined = undefined;

    if (roomId !== undefined) {
      room = this._messages.value?.find(({ room }) => room.id === roomId);
    }

    this._currentRoom = room;
  }

  get rooms() {
    if (!this._messages.value) return [];

    return this._messages.value.map((item) => item.room);
  }

  get messages() {
    return this._messages.value;
  }

  get currentRoom() {
    return this._currentRoom;
  }
}
