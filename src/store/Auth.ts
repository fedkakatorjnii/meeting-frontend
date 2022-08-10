import { Services } from '@API';
import { LoginForm, Token, NewUser, UserInfo } from '@API/models';
import { makeObservable, observable, computed, runInAction } from 'mobx';

export class AuthStore {
  readonly services: Services;
  private userInfo: UserInfo | null = null;
  private _token: Token | null = null;
  @observable private _error: Error | null = null;
  @observable private _isLoading: boolean = false;

  constructor(services: Services) {
    this.services = services;
    makeObservable(this);
  }

  @computed get error(): Error | null {
    return this._error;
  }

  @computed get token(): Token | null {
    return this._token;
  }

  @computed get isLoading(): boolean {
    return this._isLoading;
  }

  registration = async (userData: NewUser) => {
    this._isLoading = true;
    this._error = null;
    try {
      const data = await this.services.user.createUser(userData);
      console.log(data.data);
      // end registration
    } catch (e: unknown) {
      if (e instanceof Error) {
        this._error = e;
      }
    } finally {
      this._isLoading = false;
    }
  };

  login = async (userData: LoginForm) => {
    runInAction(() => {
      this._isLoading = true;
      this._error = null;
    });
    try {
      const username = await this.services.auth.login(userData);
      const user = await this.services.user
        .getUser(username)
        .then(({ data }) => data);
      this.userInfo = user;
    } catch (e: unknown) {
      if (e instanceof Error) {
        this._error = e;
      }
    } finally {
      runInAction(() => (this._isLoading = false));
    }
  };
}
