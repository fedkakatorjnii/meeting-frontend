import { action, computed, makeObservable, observable } from 'mobx';

import {
  getBooleanFromLocalStorage,
  setBooleanToLocalStorage,
} from '@common/helpers';

export class MainStore {
  _isLeftPanelOpen: boolean;
  _isRightPanelOpen: boolean;

  constructor() {
    this._isLeftPanelOpen = getBooleanFromLocalStorage(
      '_isLeftPanelOpen',
      false,
    );
    this._isRightPanelOpen = getBooleanFromLocalStorage(
      '_isRightPanelOpen',
      false,
    );

    makeObservable<MainStore, '_isLeftPanelOpen' | '_isRightPanelOpen'>(this, {
      openLeftPanel: action,
      closeRightPanel: action,
      openRightPanel: action,
      closeLeftPanel: action,
      toggleLeftPanel: action,
      toggleRightPanel: action,
      _isLeftPanelOpen: observable,
      _isRightPanelOpen: observable,
      isLeftPanelOpen: computed,
      isRightPanelOpen: computed,
    });
  }

  toggleLeftPanel = () => {
    this._isLeftPanelOpen = !this._isLeftPanelOpen;
    setBooleanToLocalStorage('_isLeftPanelOpen', this._isLeftPanelOpen);
  };

  openLeftPanel = () => {
    if (this._isLeftPanelOpen) return;

    this._isLeftPanelOpen = true;
    setBooleanToLocalStorage('_isLeftPanelOpen', this._isLeftPanelOpen);
  };

  closeLeftPanel = () => {
    if (!this._isLeftPanelOpen) return;

    this._isLeftPanelOpen = false;
    setBooleanToLocalStorage('_isLeftPanelOpen', this._isLeftPanelOpen);
  };

  toggleRightPanel = () => {
    this._isRightPanelOpen = !this._isRightPanelOpen;
    setBooleanToLocalStorage('_isRightPanelOpen', this._isRightPanelOpen);
  };

  openRightPanel = () => {
    if (this._isRightPanelOpen) return;

    this._isRightPanelOpen = true;
    setBooleanToLocalStorage('_isRightPanelOpen', this._isRightPanelOpen);
  };

  closeRightPanel = () => {
    if (!this._isRightPanelOpen) return;

    this._isRightPanelOpen = false;
    setBooleanToLocalStorage('_isRightPanelOpen', this._isRightPanelOpen);
  };

  get isLeftPanelOpen() {
    return this._isLeftPanelOpen;
  }

  get isRightPanelOpen() {
    return this._isRightPanelOpen;
  }
}
