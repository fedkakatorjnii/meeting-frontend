import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { PartialNewAnonRoomRequest } from '@API';
import { useRootStore } from '@common';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { isAnonNewRoomRequest } from '../helpers';

interface RoomsCreateDialogProps {
  onClose: () => void;
  visible?: boolean;
}

export const RoomsCreateDialog: FC<RoomsCreateDialogProps> = observer(
  ({ visible = false, onClose }) => {
    const { authStore, roomsStore } = useRootStore();
    const [room, setRoom] = useState<PartialNewAnonRoomRequest>({});
    const isComplete = isAnonNewRoomRequest(room);

    const { loading, error, value } = roomsStore.newRoom;
    const isAuth = !!authStore.authInfo;

    if (loading) {
      // TODO подумать над ожиданием
    }

    if (value && !error) {
      roomsStore.clearCreate();
      onClose();
    }

    return (
      <Dialog open={visible} onClose={onClose}>
        <DialogTitle>New Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {error && <Alert severity="error">Error!</Alert>}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="name"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setRoom((values) => ({
                ...values,
                name: e.target.value,
              }));
            }}
          />
          <TextField
            margin="dense"
            id="description"
            label="description"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setRoom((values) => ({
                ...values,
                description: e.target.value,
              }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!isComplete) return;
              if (!isAuth) return;

              roomsStore.create({
                ...room,
                owner: authStore.authInfo.userId,
              });
            }}
            variant="contained"
            color="success"
            disabled={!isComplete}
          >
            ok
          </Button>
          <Button
            onClick={() => {
              roomsStore.clearCreate();
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

RoomsCreateDialog.displayName = 'RoomsCreateDialog';
