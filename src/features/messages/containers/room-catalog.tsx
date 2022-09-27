import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { List } from '@mui/material';

import { useRootStore } from '@common';
import { ListWrapper, MessagesListHeader, RoomListItem } from '../components';

export const RoomCatalog: FC = observer(() => {
  const { messagesStore } = useRootStore();

  useEffect(() => {
    messagesStore.listToRooms();
  }, []);

  const roomId = messagesStore.currentRoom?.room.id;

  return (
    <ListWrapper>
      <MessagesListHeader options={[]} />
      <List>
        {messagesStore.rooms.map((item) => (
          <RoomListItem
            key={item.id}
            item={item}
            onSelect={(item) => messagesStore.changeCurrentRoom(item.id)}
            selected={roomId === item.id}
          />
        ))}
      </List>
    </ListWrapper>
  );
});

RoomCatalog.displayName = 'RoomCatalog';
