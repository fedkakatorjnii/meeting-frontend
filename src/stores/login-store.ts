import { action, makeObservable } from 'mobx';

import { Services, services as apiServices } from '../services';

export class LoginStore {
  #services: Services;

  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<LoginStore>(this, {
      login: action,
    });
  }

  async login(username: string, password: string) {
    await this.#services.auth.login(username, password);
  }
}
