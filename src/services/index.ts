import { getAuthInstance } from './auth';
import { User } from './user';

export const services = {
  auth: getAuthInstance(),
  user: new User(),
};

export type Services = typeof services;
