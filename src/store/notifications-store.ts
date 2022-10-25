import { action, computed, makeObservable, observable } from 'mobx';

import { Services, services as apiServices } from '@API';
import { AlertColor } from '@mui/material';

export interface Notification {
  msg: string;
  severity: AlertColor;
}

// TODO подумать надо очередью
export class NotificationsStore {
  #services: Services;
  _other: Notification[] = [];
  _current: Notification[] = [];
  _count = 3;

  constructor(services = apiServices) {
    this.#services = services;

    makeObservable<NotificationsStore, '_other' | '_current'>(this, {
      add: action,
      pop: action,
      _other: observable,
      _current: observable,
      _count: observable,
      list: computed,
    });
  }

  add = (notification: Notification) => {
    if (this._current.length > 3) {
      this._other.push(notification);
    } else {
      this._current.push(notification);
    }
  };

  pop = (n = 0) => {
    this._current.splice(n, n + 1);
    const current = this._other.shift();

    if (current) {
      this._current.push(current);
    }
  };

  get list() {
    return this._current;
  }
}
