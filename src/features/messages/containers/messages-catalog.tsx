import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { useRootStore } from '@common';
import {
  ListWrapper,
  MessagesListHeader,
  MessagesListItem,
  MessagesListFooter,
} from '../components';

export const MessagesCatalog: FC = observer(() => {
  const { roomsStore, messagesStore } = useRootStore();

  const currentRoom = roomsStore.currentRoom;

  // TODO
  if (!currentRoom) return null;

  return (
    <>
      <MessagesListHeader
        options={[]}
        onBack={() => roomsStore.changeCurrentRoom()}
      />
      <ListWrapper>
        <List>
          {currentRoom.messages?.value?.items.map((item) => (
            <MessagesListItem key={item.id} item={item} />
          ))}
        </List>
      </ListWrapper>
      <MessagesListFooter
        onSend={(message) => {
          const newMessage = message?.trim();

          if (!newMessage) return;

          messagesStore.sendMessage(currentRoom.id, newMessage);
        }}
      />
    </>
  );
});

MessagesCatalog.displayName = 'MessagesCatalog';
