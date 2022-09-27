import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { MessagesCollectionToRoomResponse } from '@API';
import { useRootStore } from '@common';
import {
  ListWrapper,
  MessagesListHeader,
  MessagesListItem,
} from '../components';
import { MessagesMessageFooter } from '../components/messages-message-footer';

interface MessageCatalogProps {
  item: MessagesCollectionToRoomResponse;
}

export const MessageCatalog: FC<MessageCatalogProps> = observer(({ item }) => {
  const { messages } = item;
  const { messagesStore } = useRootStore();

  return (
    <>
      <MessagesListHeader
        options={[]}
        onBack={() => messagesStore.changeCurrentRoom()}
      />
      <ListWrapper>
        <List>
          {messages.items.map((item) => (
            <MessagesListItem key={item.id} item={item} />
          ))}
        </List>
      </ListWrapper>
      <MessagesMessageFooter
        onSend={(message) => {
          const newMessage = message?.trim();

          if (!newMessage) return;

          messagesStore.send(newMessage, item.room.id);
        }}
      />
    </>
  );
});

MessageCatalog.displayName = 'MessageCatalog';
