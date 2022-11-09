import { services as apiServices } from '@API';
import { AuthStore } from './auth';
import { MainStore } from './main-store';
import { UserStore } from './user';
import { RoomsStore } from './rooms';
import { NotificationsStore } from './notifications-store';
import { GeolocationStore } from './geolocation-store';
import { MapStore } from './map';

export class RootStore {
  mainStore: MainStore;
  authStore: AuthStore;
  userStore: UserStore;
  roomsStore: RoomsStore;
  notificationsStore: NotificationsStore;
  geolocationStore: GeolocationStore;
  mapStore: MapStore;

  constructor(services = apiServices) {
    this.notificationsStore = new NotificationsStore(services);
    this.mainStore = new MainStore();
    this.authStore = new AuthStore(services);
    this.userStore = new UserStore(services);
    this.roomsStore = new RoomsStore(services, this.notificationsStore);
    this.geolocationStore = new GeolocationStore(services);
    this.mapStore = new MapStore(this.geolocationStore, {});
  }
}
