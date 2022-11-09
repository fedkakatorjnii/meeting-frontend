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
  const { roomsStore } = useRootStore();

  const messages = roomsStore.currentRoom?.messages;

  return (
    <>
      <MessagesListHeader
        options={[]}
        onBack={() => roomsStore.changeCurrentRoom()}
      />
      <ListWrapper>
        <List>
          {messages?.value?.items.map((item) => (
            <MessagesListItem key={item.id} item={item} />
          ))}
        </List>
      </ListWrapper>
      <MessagesListFooter
        onSend={(message) => {
          const newMessage = message?.trim();

          if (!newMessage) return;

          // messagesStore.send(newMessage, item.room.id);
        }}
      />
    </>
  );
});

MessagesCatalog.displayName = 'MessagesCatalog';
