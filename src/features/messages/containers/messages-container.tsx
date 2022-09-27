import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { MessageCatalog } from './message-catalog';
import { RoomCatalog } from './room-catalog';

export const MessagesContainer: FC = observer(() => {
  const { messagesStore } = useRootStore();

  if (messagesStore.currentRoom) {
    return <MessageCatalog item={messagesStore.currentRoom} />;
  }

  return <RoomCatalog />;
});
