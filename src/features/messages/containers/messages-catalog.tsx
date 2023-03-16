import React, { FC, useEffect, useRef, useState } from 'react';
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
  const [deleteMessageId, setDeleteMessageId] = useState<MessageIdRequest>();
  const listRef = useRef<HTMLDivElement | null>(null);

  const currentRoom = roomsStore.currentRoom;

  useEffect(() => {
    if (!listRef.current) return;

    // TODO подумать как по другому перемещать скрол вниз
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [listRef]);

  // TODO
  if (!currentRoom) return null;

  messagesSocketStore.readMessages(currentRoom.id, currentRoom.messages.newIds);

  return (
    <>
      <MessagesListHeader
        options={[]}
        onBack={() => roomsStore.changeCurrentRoom()}
      />
      <ListWrapper ref={listRef}>
        <List>
          {currentRoom.messages.values.value?.items.map((message) => (
            <MessagesListItem
              key={message.id}
              item={{
                message,
                isNew: !currentRoom.messages.isNewMessage(message.id),
              }}
              selected={
                deleteMessageId === message.id ||
                currentRoom.messages.currentMessageId === message.id
              }
              onSelect={(item) => {
                currentRoom.messages.changeCurrentMessage(item.message.id);
              }}
              onDelete={({ message: { id } }) => {
                setDeleteMessageId(id);
              }}
            />
          ))}
        </List>
      </ListWrapper>
      <MessagesListFooter
        onSend={(message) => {
          messagesSocketStore.sendMessage(currentRoom.id, message);

          // if (message instanceof Blob) {
          //   messagesSocketStore.sendMediaMessage(currentRoom.id, message);
          // } else {
          //   messagesSocketStore.sendMessage(currentRoom.id, message);
          // }
        }}
      />
      <MessagesDeleteDialog
        roomId={currentRoom.id}
        messageId={deleteMessageId}
        onClose={() => setDeleteMessageId(undefined)}
      />
    </>
  );
});

MessagesCatalog.displayName = 'MessagesCatalog';
