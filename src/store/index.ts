import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { ChatStore } from './chat';
import { MainStore } from './main-store';
import { MapStore } from './map';
import { UserStore } from './user';
export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  userStore: UserStore;
  chatStore: ChatStore;
  mapStore: MapStore;

  constructor(services = apiServices) {
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.chatStore = new ChatStore(services);
    this.mapStore = new MapStore();
  }
}
