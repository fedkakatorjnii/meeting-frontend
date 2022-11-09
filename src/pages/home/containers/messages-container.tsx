import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { MessagesCatalog } from '@features/messages';
import { RoomsCatalog } from '@features/rooms';

export const MessagesContainer: FC = observer(() => {
  const { roomsStore } = useRootStore();

  if (roomsStore.currentRoom) return <MessagesCatalog />;

  return <RoomsCatalog />;
});
