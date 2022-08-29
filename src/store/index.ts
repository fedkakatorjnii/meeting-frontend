import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { ChatStore } from './chat';
import { MainStore } from './main-store';
import { UserStore } from './user';
export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  userStore: UserStore;
  chatStore: ChatStore;

  constructor(services = apiServices) {
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.chatStore = new ChatStore(services);
  }
}
