import React, { FC, useEffect, useState } from 'react';
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
  const { roomsStore, authStore, messagesSocketStore } = useRootStore();
  const [isVisibleDeleteDialog, setIsVisibleDeleteDialog] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState<MessageIdRequest>();

  const currentRoom = roomsStore.currentRoom;

  // TODO
  if (!currentRoom) return null;

  useEffect(() => {
    const messageIds =
      currentRoom.messages.values.value?.items.map((item) => item.id) || [];
    messagesSocketStore.readMessages(currentRoom.id, messageIds);
  }, []);

  return (
    <>
      <MessagesListHeader
        options={[]}
        onBack={() => roomsStore.changeCurrentRoom()}
      />
      <ListWrapper>
        <List>
          {currentRoom.messages.values.value?.items.map((message) => (
            <MessagesListItem
              key={message.id}
              item={{
                message,
                isNew: !currentRoom.messages.new.find(
                  (item) => item.id === message.id,
                ),
              }}
              selected={deleteMessageId === message.id}
              onDelete={({ message }) => {
                setDeleteMessageId(message.id);
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
