import { services as apiServices } from '../services';

import { LoginStore } from './login-store';
import { UserStore } from './user-store';

export class RootStore {
  loginStore: LoginStore;
  usersStore: UserStore;

  constructor(services = apiServices) {
    this.loginStore = new LoginStore(services);
    this.usersStore = new UserStore(services);
  }
}
