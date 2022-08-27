import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { ChatStore } from './chat';
import { UserStore } from './user';
export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  chatStore: ChatStore;

  constructor(services = apiServices) {
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.chatStore = new ChatStore(services);
  }
}
