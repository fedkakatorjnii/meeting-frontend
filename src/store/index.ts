import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { MessagesStore } from './messages';
import { MainStore } from './main-store';
import { UserStore } from './user';
import { RoomStore } from './rooms';
import { NotificationsStore } from './notifications-store';

export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  userStore: UserStore;
  messagesStore: MessagesStore;
  roomStore: RoomStore;
  notificationsStore: NotificationsStore;

  constructor(services = apiServices) {
    this.notificationsStore = new NotificationsStore(services);
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.messagesStore = new MessagesStore(services);
    this.roomStore = new RoomStore(services, this.notificationsStore);
  }
}
