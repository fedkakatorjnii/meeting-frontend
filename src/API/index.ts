import { getAuthInstance } from './auth';
import { User } from './user';
import { Room } from './room';
import { Messages } from './messages';
export * from './types';

export const services = {
  auth: getAuthInstance(),
  user: new User(),
  room: new Room(),
  messages: new Messages(),
};

export type Services = typeof services;
