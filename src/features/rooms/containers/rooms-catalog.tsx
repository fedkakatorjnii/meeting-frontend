import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { useRootStore } from '@common';
import {
  ListWrapper,
  RoomsListHeader,
  RoomListItem,
  RoomsListFooter,
} from '../components';
import { RoomsCreateDialog } from './rooms-create-dialog';
import { RoomsDeleteDialog } from './rooms-delete-dialog';
import { RoomId } from '@API';

export const RoomsCatalog: FC = observer(() => {
  const { messagesStore, roomStore } = useRootStore();
  const [isVisibleCreateDialog, setIsVisibleCreateDialog] = useState(false);
  const [isVisibleDeleteDialog, setIsVisibleDeleteDialog] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState<RoomId>();

  useEffect(() => {
    roomStore.list();
  }, []);

  const rooms = roomStore.rooms.value?.items || [];

  return (
    <>
      <ListWrapper>
        <RoomsListHeader options={[]} />
        <List>
          {rooms.map((item) => (
            <RoomListItem
              key={item.id}
              item={item}
              onSelect={({ id }) => messagesStore.changeCurrentRoom(id)}
              selected={roomStore.currentRoomId === item.id}
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
