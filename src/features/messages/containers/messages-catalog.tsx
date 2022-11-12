import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { useRootStore } from '@common';
import {
  ListWrapper,
  MessagesListHeader,
  MessagesListItem,
  MessagesListFooter,
} from '../components';
import { MessagesDeleteDialog } from './messages-delete-dialog';
import { MessageIdRequest } from '@API';

export const MessagesCatalog: FC = observer(() => {
  const { roomsStore, messagesSocketStore } = useRootStore();
  const [isVisibleDeleteDialog, setIsVisibleDeleteDialog] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState<MessageIdRequest>();

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
          {currentRoom.messages.values.value?.items.map((item) => (
            <MessagesListItem
              key={item.id}
              item={item}
              selected={deleteMessageId === item.id}
              onDelete={({ id }) => {
                setDeleteMessageId(id);
                setIsVisibleDeleteDialog(true);
              }}
            />
          ))}
        </List>
      </ListWrapper>
      <MessagesListFooter
        onSend={(message) => {
          const newMessage = message?.trim();

          if (!newMessage) return;

          messagesSocketStore.sendMessage(currentRoom.id, newMessage);
        }}
      />
      <MessagesDeleteDialog
        visible={isVisibleDeleteDialog}
        roomId={currentRoom.id}
        messageId={deleteMessageId}
        onClose={() => setIsVisibleDeleteDialog(false)}
      />
    </>
  );
});

MessagesCatalog.displayName = 'MessagesCatalog';
