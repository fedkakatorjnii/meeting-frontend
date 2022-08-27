import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

import { backendUrl } from '@common';

let instance: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

export const getSocketInstance = (baseURL = backendUrl) => {
  if (!instance) {
    instance = io(baseURL);
  }

  return instance;
};
