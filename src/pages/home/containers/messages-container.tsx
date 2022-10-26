import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { MessagesCatalog } from '@features/messages';
import { RoomsCatalog } from '@features/rooms';

export const MessagesContainer: FC = observer(() => {
  const { messagesStore } = useRootStore();

  if (messagesStore.currentRoom) {
    return <MessagesCatalog item={messagesStore.currentRoom} />;
  }

  return <RoomsCatalog />;
});
