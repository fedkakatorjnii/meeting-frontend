import { MetaData, Services } from '@API';
import { LoginRequest } from '@API';
import {
  makeObservable,
  observable,
  computed,
  runInAction,
  action,
} from 'mobx';

export class AuthStore {
  readonly services: Services;
  private _token: MetaData<undefined> = {
    loading: false,
  };

  constructor(services: Services) {
    this.services = services;
    makeObservable<AuthStore, '_token'>(this, {
      login: action,
      _token: observable,
      error: computed,
      isLoading: computed,
    });
  }

  get error(): Error | undefined {
    return this._token.error;
  }

  get isLoading(): boolean {
    return this._token.loading;
  }

  login = async ({ username, password }: LoginRequest) => {
    try {
      runInAction(() => {
        this._token = {
          loading: true,
        };
      });
      await this.services.auth.login(username, password);
    } catch (e) {
      let error = new Error('Ошибка авторизации.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._token.error = error;
      });
    } finally {
      runInAction(() => {
        this._token.loading = false;
      });
    }
  };
}
