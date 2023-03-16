import { getAuthInstance } from './auth';
import { User } from './user';
import { Room } from './room';
import { Messages } from './messages';
import { Geolocations } from './geolocation';
export * from './types';

export const services = {
  auth: getAuthInstance(),
  user: new User(),
  room: new Room(),
  messages: new Messages(),
  geolocations: new Geolocations(),
};

export type Services = typeof services;
