import React, { FC, useState } from 'react';
import {
  NewAnonRoomRequest,
  NewRoomRequest,
  PartialNewAnonRoomRequest,
  PartialNewRoomRequest,
  UserIdRequest,
} from '@API';
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
import { observer } from 'mobx-react-lite';

const isUserId = (value?: any): value is UserIdRequest => {
  if (typeof value === 'number' && !Number.isNaN(value)) return true;
  if (typeof value === 'string' && value !== '') return true;

  return false;
};
const isAnonNewRoomRequest = (
  values: PartialNewAnonRoomRequest,
): values is NewAnonRoomRequest => {
  const { name, description, photo } = values;

  if (name === undefined || typeof name !== 'string' || name === '') {
    return false;
  }
  if (description !== undefined && (typeof name !== 'string' || name === '')) {
    return false;
  }
  if (photo !== undefined && (typeof photo !== 'string' || photo === '')) {
    return false;
  }

  return true;
};

const isNewRoomRequest = (
  values: PartialNewRoomRequest,
): values is NewRoomRequest => {
  if (!isUserId(values.owner)) return false;
  if (!isAnonNewRoomRequest(values)) return false;

  return true;
};

interface RoomsCreateDialogProps {
  onClose: () => void;
  visible?: boolean;
}

export const RoomsCreateDialog: FC<RoomsCreateDialogProps> = observer(
  ({ visible = false, onClose }) => {
    const { authStore, roomStore } = useRootStore();
    const [room, setRoom] = useState<PartialNewAnonRoomRequest>({});
    const isComplete = isAnonNewRoomRequest(room);
    const { loading, error, value } = roomStore.newRoom;

    if (loading) {
      // TODO
    }

    if (value && !error) {
      roomStore.clearCreate();
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
              if (!authStore.authInfo) return;

              roomStore.create({
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
              roomStore.clearCreate();
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
