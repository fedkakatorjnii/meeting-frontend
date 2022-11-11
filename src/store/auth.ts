import { MetaData, Services, UserInfoForToken } from '@API';
import { LoginRequest } from '@API';
import {
  makeObservable,
  observable,
  computed,
  runInAction,
  action,
} from 'mobx';

export class AuthStore {
  readonly #services: Services;
  private _auth: MetaData<UserInfoForToken> = {
    loading: false,
  };

  constructor(services: Services) {
    this.#services = services;

    makeObservable<AuthStore, '_auth'>(this, {
      login: action,
      logout: action,
      refresh: action,
      _auth: observable,
      error: computed,
      isLoading: computed,
      isAuth: computed,
    });
  }

  get error(): Error | undefined {
    return this._auth.error;
  }

  get isLoading(): boolean {
    return this._auth.loading;
  }

  get authInfo(): UserInfoForToken | undefined {
    return this._auth.value;
  }

  get isAuth(): boolean {
    return !!this._auth.value;
  }

  login = async (auth: LoginRequest) => {
    try {
      runInAction(() => {
        this._auth = {
          loading: true,
        };
      });

      const authInfo = await this.#services.auth.login(auth);

      runInAction(() => {
        this._auth.value = authInfo;
      });
    } catch (e) {
      let error = new Error('Ошибка авторизации.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._auth.error = error;
        this._auth.value = undefined;
      });
    } finally {
      runInAction(() => {
        this._auth.loading = false;
      });
    }
  };

  logout = () => {
    this.#services.auth.logout();
    this._auth.value = undefined;
  };

  refresh = async () => {
    try {
      runInAction(() => {
        this._auth = {
          loading: true,
        };
      });
      const authInfo = await this.#services.auth.login();

      runInAction(() => {
        this._auth.value = authInfo;
      });
    } catch (e) {
      let error = new Error('Ошибка авторизации.');

      if (e instanceof Error) {
        error = e;
      }

      runInAction(() => {
        this._auth.error = error;
        this._auth.value = undefined;
      });
    } finally {
      runInAction(() => {
        this._auth.loading = false;
      });
    }
  };
}
