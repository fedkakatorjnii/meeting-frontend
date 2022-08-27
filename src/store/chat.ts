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
  MessageCollectionResponse,
} from '@API';
import { UserStore } from './user';

export class ChatStore {
  #services: Services;

  private _messages: MetaData<MessageCollectionResponse> = {
    loading: false,
  };

  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<ChatStore, '_messages'>(this, {
      send: action,
      load: action,
      _messages: observable,
      messages: computed,
    });
  }

  async load() {
    try {
      this._messages = {
        loading: true,
      };

      const res = await this.#services.messages.list(1, 1);

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

  get messages() {
    return this._messages.value;
  }
}
