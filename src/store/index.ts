import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { UserStore } from './user';
export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;

  constructor(services = apiServices) {
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
  }
}
