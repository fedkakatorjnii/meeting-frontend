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
    const { authStore, roomsStore } = useRootStore();
    const room = roomsStore.rooms?.find((room) => room.id === roomId);
    const isAuth = !!authStore.authInfo;

    // TODO подумать что делать если комната не найдена
    if (!room) return null;

    const { loading, error, value } = room.deleteValue;

    if (loading) {
      // TODO подумать над ожиданием
    }

    if (value && !error) {
      room.clearDelete();
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
              if (!isAuth) return;

              room.delete();
            }}
            variant="contained"
            color="error"
            disabled={!isAuth}
          >
            ok
          </Button>
          <Button
            onClick={() => {
              room.clearDelete();
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

RoomsDeleteDialog.displayName = 'RoomsDeleteDialog';
