import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import { Services, MetaData, UserResponse, UserIdRequest } from '@API';
import { AuthStore } from './auth';

interface ProfileStores {
  authStore: AuthStore;
}

export class ProfileStore {
  readonly #services: Services;
  readonly #authStore: AuthStore;

  userId: UserIdRequest | undefined;
  private _user: MetaData<UserResponse> = {
    loading: false,
  };

  constructor(services: Services, { authStore }: ProfileStores) {
    this.#services = services;
    this.#authStore = authStore;

    makeObservable<ProfileStore, '_user'>(this, {
      load: action,
      _user: observable,
      user: computed,
    });
  }

  async load() {
    if (this.#authStore.authInfo?.userId === undefined) return;

    const { userId } = this.#authStore.authInfo;

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

  get user() {
    return this._user;
  }
}
