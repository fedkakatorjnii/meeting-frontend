import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { RoomId } from '@API';
import { useRootStore } from '@common';
import {
  ListWrapper,
  RoomsListHeader,
  RoomListItem,
  RoomsListFooter,
} from '../components';
import { RoomsCreateDialog } from './rooms-create-dialog';
import { RoomsDeleteDialog } from './rooms-delete-dialog';

export const RoomsCatalog: FC = observer(() => {
  const { roomsStore } = useRootStore();
  const [isVisibleCreateDialog, setIsVisibleCreateDialog] = useState(false);
  const [isVisibleDeleteDialog, setIsVisibleDeleteDialog] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<RoomId>();

  useEffect(() => {
    roomsStore.listToRooms();
  }, []);

  const rooms = roomsStore.rooms || [];

  return (
    <>
      <ListWrapper>
        <RoomsListHeader options={[]} />
        <List>
          {rooms.map((room) => (
            <RoomListItem
              key={room.id}
              item={room.value.value}
              onSelect={({ id }) => {
                roomsStore.changeCurrentRoom(id);
              }}
              selected={roomsStore.currentRoomId === room.id}
              onDelete={({ id }) => {
                setDeleteRoomId(id);
                setIsVisibleDeleteDialog(true);
              }}
            />
          ))}
        </List>
      </ListWrapper>
      <RoomsListFooter
        onCreate={() => {
          setIsVisibleCreateDialog(true);
        }}
      />
      <RoomsCreateDialog
        visible={isVisibleCreateDialog}
        onClose={() => setIsVisibleCreateDialog(false)}
      />
      <RoomsDeleteDialog
        visible={isVisibleDeleteDialog}
        roomId={deleteRoomId}
        onClose={() => setIsVisibleDeleteDialog(false)}
      />
    </>
  );
});

RoomsCatalog.displayName = 'RoomsCatalog';
