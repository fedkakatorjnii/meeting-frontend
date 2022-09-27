import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { MessagesStore } from './messages';
import { MainStore } from './main-store';
import { UserStore } from './user';
export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  userStore: UserStore;
  messagesStore: MessagesStore;

  constructor(services = apiServices) {
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.messagesStore = new MessagesStore(services);
  }
}
