import { action, computed, makeObservable, observable } from 'mobx';

import { Services, services as apiServices } from '../services';
import {
  MetaData,
  UserCollectionResponse,
  UserResponse,
} from '../services/types';

export class UserStore {
  #services: Services;
  private _users: MetaData<UserCollectionResponse> = {
    loading: false,
  };
  private _user: MetaData<UserResponse> = {
    loading: false,
  };

  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<UserStore, '_users' | '_user'>(this, {
      list: action,
      _users: observable,
      _user: observable,
      users: computed,
      user: computed,
    });
  }

  async list() {
    try {
      this._users = {
        loading: true,
      };

      const res = await this.#services.user.list();

      this._users.value = res;
    } catch (e) {
      let error = new Error('Ошибка получения списка пользователей.');

      if (e instanceof Error) {
        error = e;
      }

      this._users.error = error;
    } finally {
      this._users.loading = false;
    }
  }

  async find(username: string) {
    try {
      this._user = {
        loading: true,
      };

      const res = await this.#services.user.find(username);

      this._user.value = res;
    } catch (e) {
      let error = new Error('Ошибка получения пользователя.');

      if (e instanceof Error) {
        error = e;
      }

      this._user.error = error;
    } finally {
      this._user.loading = false;
    }
  }

  get users() {
    return this._users.value;
  }

  get user() {
    return this._user.value;
  }
}
