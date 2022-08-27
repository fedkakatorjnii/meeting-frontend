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
  UserIdRequest,
} from '@API';

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

  private _deleteUser: MetaData<boolean> = {
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

  async find(userId: UserIdRequest) {
    try {
      runInAction(() => {
        this._user = {
          loading: true,
        };
      });

      const res = await this.#services.user.find(userId);

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

  async delete(userId: UserIdRequest) {
    try {
      runInAction(() => {
        this._deleteUser = {
          loading: true,
        };
      });
      await this.#services.user.delete(userId);

      runInAction(() => {
        this._deleteUser.value = true;
      });
    } catch (e) {
      let error = new Error('Ошибка удаления пользователя.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._deleteUser.error = error;
      });
    } finally {
      runInAction(() => {
        this._deleteUser.loading = false;
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

  get deleteUser() {
    return this._deleteUser;
  }
}
