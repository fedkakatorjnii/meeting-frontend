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

import { RoomIdRequest } from '@API';
import { useRootStore } from '@common';

interface RoomsCreateDialogProps {
  onClose: () => void;
  roomId?: RoomIdRequest;
  visible?: boolean;
}

export const RoomsDeleteDialog: FC<RoomsCreateDialogProps> = observer(
  ({ visible = false, roomId, onClose }) => {
    const { authStore, roomStore } = useRootStore();
    const { loading, error, value } = roomStore.deleteRoom;
    const isComplete = roomId !== undefined;

    if (loading) {
      // TODO
    }

    if (value && !error) {
      roomStore.clearDelete();
      onClose();
    }

    return (
      <Dialog open={visible} onClose={onClose}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <DialogContentText>{/*  */}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!isComplete) return;
              if (!authStore.authInfo) return;

              roomStore.delete(roomId);
            }}
            variant="contained"
            color="error"
            disabled={!isComplete}
          >
            ok
          </Button>
          <Button
            onClick={() => {
              roomStore.clearDelete();
              onClose();
            }}
            variant="contained"
            color="inherit"
          >
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);
