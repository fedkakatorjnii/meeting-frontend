import { Auth, User } from './resources';

export class Services {
  readonly auth: Auth;
  readonly user: User;

  constructor() {
    const auth = new Auth();

    this.auth = auth;
    this.user = new User(this.auth);
  }
}

export const services = new Services();
