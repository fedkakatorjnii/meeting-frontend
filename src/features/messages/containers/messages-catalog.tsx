import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { MessagesCollectionToRoomResponse } from '@API';
import { useRootStore } from '@common';
import {
  ListWrapper,
  MessagesListHeader,
  MessagesListItem,
  MessagesListFooter,
} from '../components';

interface MessagesCatalogProps {
  item: MessagesCollectionToRoomResponse;
}

export const MessagesCatalog: FC<MessagesCatalogProps> = observer(
  ({ item }) => {
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
        <MessagesListFooter
          onSend={(message) => {
            const newMessage = message?.trim();

            if (!newMessage) return;

            messagesStore.send(newMessage, item.room.id);
          }}
        />
      </>
    );
  },
);

MessagesCatalog.displayName = 'MessagesCatalog';
