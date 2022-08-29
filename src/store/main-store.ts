import { action, computed, makeObservable, observable } from 'mobx';

export class MainStore {
  _isLeftPanelOpen = false;
  _isRightPanelOpen = false;

  constructor() {
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
  };

  openLeftPanel = () => {
    if (this._isLeftPanelOpen) return;

    this._isLeftPanelOpen = true;
  };

  closeLeftPanel = () => {
    if (!this._isLeftPanelOpen) return;

    this._isLeftPanelOpen = false;
  };

  toggleRightPanel = () => {
    this._isRightPanelOpen = !this._isRightPanelOpen;
  };

  openRightPanel = () => {
    if (this._isRightPanelOpen) return;

    this._isRightPanelOpen = true;
  };

  closeRightPanel = () => {
    if (!this._isRightPanelOpen) return;

    this._isRightPanelOpen = false;
  };

  get isLeftPanelOpen() {
    return this._isLeftPanelOpen;
  }

  get isRightPanelOpen() {
    return this._isRightPanelOpen;
  }
}
