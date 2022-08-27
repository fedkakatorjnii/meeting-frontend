import { getAuthInstance } from './auth';
import { Messages } from './messages';
import { User } from './user';
export * from './types';

export const services = {
  auth: getAuthInstance(),
  user: new User(),
  messages: new Messages(),
};

export type Services = typeof services;
