import { io } from 'socket.io-client';

import { socketUrl } from '@common';

export const getWsInstance = (baseURL = socketUrl, token: string) => {
  const socket = io(baseURL, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    },
  });

  return socket;
};
