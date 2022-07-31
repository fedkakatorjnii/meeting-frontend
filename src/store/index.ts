import { services } from '../API';
import { AuthStore } from './Auth';

export class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore(services);
  }
}
