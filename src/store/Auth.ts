import { Services } from '../API';
import { makeObservable, observable, computed, action } from 'mobx';
import { NewUser, LoginForm, UserInfo } from '../API/resources/Auth';

export class AuthStore {
  readonly services: Services;
  private userInfo: UserInfo | null = null;
  @observable private _error: Error | null = null;
  @observable private _isLoading: boolean = false;

  constructor(services: Services) {
    this.services = services;
    makeObservable(this);
  }

  @computed get error(): Error | null {
    return this._error;
  }

  @computed get isLoading(): boolean {
    return this._isLoading;
  }

  registration = async (userData: NewUser) => {
    this._isLoading = true;
    this._error = null;
    try {
      const data = await this.services.auth.createUser(userData);
      console.log(data.data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this._error = e;
      }
    } finally {
      this._isLoading = false;
    }
  };

  login = async (userData: LoginForm) => {
    this._isLoading = true;
    this._error = null;
    try {
      const token = await this.services.auth.login(userData);
      console.log(token.data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this._error = e;
      }
    } finally {
      this._isLoading = false;
    }
  };
}
