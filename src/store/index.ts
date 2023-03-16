import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { ProfileStore } from './profile-store';
import { MainStore } from './main-store';
import { UserStore } from './user';
import { RoomsStore } from './rooms';
import { NotificationsStore } from './notifications-store';
import { GeolocationStore } from './geolocation-store';
import { MapStore } from './map';
import { MessagesSocketStore } from './messages-socket-store';

export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  profileStore: ProfileStore;
  userStore: UserStore;
  roomsStore: RoomsStore;
  notificationsStore: NotificationsStore;
  geolocationStore: GeolocationStore;
  mapStore: MapStore;
  messagesSocketStore: MessagesSocketStore;

  constructor(services = apiServices) {
    this.notificationsStore = new NotificationsStore(services);
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.profileStore = new ProfileStore(services, {
      authStore: this.authStore,
    });
    this.userStore = new UserStore(services);
    this.roomsStore = new RoomsStore(services, {
      authStore: this.authStore,
      notificationsStore: this.notificationsStore,
    });
    this.geolocationStore = new GeolocationStore(services, {
      authStore: this.authStore,
      notificationsStore: this.notificationsStore,
      roomsStore: this.roomsStore,
    });
    this.mapStore = new MapStore(this.geolocationStore, {});
    this.messagesSocketStore = new MessagesSocketStore(services, {
      authStore: this.authStore,
      notificationsStore: this.notificationsStore,
      roomsStore: this.roomsStore,
    });
  }
}
