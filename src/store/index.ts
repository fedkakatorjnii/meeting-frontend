import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { MainStore } from './main-store';
import { UserStore } from './user';
import { RoomsStore } from './rooms';
import { NotificationsStore } from './notifications-store';
import { GeolocationStore } from './geolocation-store';
import { MapStore } from './map';
import { MessagesStore } from './messages';

export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  userStore: UserStore;
  roomsStore: RoomsStore;
  notificationsStore: NotificationsStore;
  geolocationStore: GeolocationStore;
  mapStore: MapStore;
  messagesStore: MessagesStore;

  constructor(services = apiServices) {
    this.notificationsStore = new NotificationsStore(services);
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.roomsStore = new RoomsStore(services, {
      authStore: this.authStore,
      notificationsStore: this.notificationsStore,
    });
    this.geolocationStore = new GeolocationStore(services);
    this.mapStore = new MapStore(this.geolocationStore, {});
    this.messagesStore = new MessagesStore(services, {
      authStore: this.authStore,
      notificationsStore: this.notificationsStore,
      roomsStore: this.roomsStore,
    });
  }
}
