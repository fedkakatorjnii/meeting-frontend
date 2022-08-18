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
  UserCollectionResponse,
  UserResponse,
  NewUserRequest,
} from '@API';

const URL = process.env.BACKEND_URL;

export class UserStore {
  #services: Services;
  private _users: MetaData<UserCollectionResponse> = {
    loading: false,
  };
  private _user: MetaData<UserResponse> = {
    loading: false,
  };

  private _newUser: MetaData<UserResponse> = {
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

      runInAction(() => {
        this._users.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения списка пользователей.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._users.error = error;
      });
    } finally {
      runInAction(() => {
        this._users.loading = false;
      });
    }
  }

  async find(username: string) {
    try {
      runInAction(() => {
        this._user = {
          loading: true,
        };
      });

      const res = await this.#services.user.find(username);

      runInAction(() => {
        this._user.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка получения пользователя.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._user.error = error;
      });
    } finally {
      runInAction(() => {
        this._user.loading = false;
      });
    }
  }

  async create(data: NewUserRequest) {
    try {
      runInAction(() => {
        this._newUser = {
          loading: true,
        };
      });
      const res = await this.#services.user.create(data);

      runInAction(() => {
        this._newUser.value = res;
      });
    } catch (e) {
      let error = new Error('Ошибка создания пользователя.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._newUser.error = error;
      });
    } finally {
      runInAction(() => {
        this._newUser.loading = false;
      });
    }
  }

  get users() {
    return this._users.value;
  }

  get user() {
    return this._user.value;
  }

  get newUser() {
    return this._newUser.value;
  }
}
