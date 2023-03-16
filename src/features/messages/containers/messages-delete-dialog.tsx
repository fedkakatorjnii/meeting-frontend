import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { MessageIdRequest, RoomIdRequest } from '@API';
import { useRootStore } from '@common';

interface MessagesCreateDialogProps {
  onClose: () => void;
  roomId?: RoomIdRequest;
  messageId?: MessageIdRequest;
}

export const MessagesDeleteDialog: FC<MessagesCreateDialogProps> = observer(
  ({ roomId, messageId, onClose }) => {
    const { authStore, roomsStore, messagesSocketStore } = useRootStore();
    const room = roomsStore.rooms?.find((room) => room.id === roomId);
    const isAuth = !!authStore.authInfo;

    if (!room) return null;
    if (!room.messages.values.value) return null;
    const { items: messages } = room.messages.values.value;

    const message = messages.find((message) => message.id === messageId);
    const visible = messageId !== undefined && message !== undefined;

    if (messageId !== undefined && message === undefined) {
      onClose();
    }

    return (
      <Dialog open={visible} onClose={onClose}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>{/*  */}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!isAuth) return;
              if (messageId === undefined) return;
              if (roomId === undefined) return;

              messagesSocketStore.deleteMessage(roomId, messageId);
            }}
            variant="contained"
            color="error"
            disabled={!isAuth}
          >
            ok
          </Button>
          <Button onClick={() => onClose()} variant="contained" color="inherit">
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

MessagesDeleteDialog.displayName = 'MessagesDeleteDialog';
