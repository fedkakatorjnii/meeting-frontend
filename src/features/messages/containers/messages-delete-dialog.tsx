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
  visible?: boolean;
}

export const MessagesDeleteDialog: FC<MessagesCreateDialogProps> = observer(
  ({ visible = false, roomId, messageId, onClose }) => {
    const { authStore, roomsStore, messagesSocketStore } = useRootStore();
    const room = roomsStore.rooms?.find((room) => room.id === roomId);

    const isAuth = !!authStore.authInfo;

    // TODO подумать что делать если комната не найдена
    if (!room) return null;

    const messages = room.messages;

    const { loading, error, value } = messages.deleteValue;

    if (loading) {
      // TODO подумать над ожиданием
    }

    if (value && !error) {
      messages.clearDelete();
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
