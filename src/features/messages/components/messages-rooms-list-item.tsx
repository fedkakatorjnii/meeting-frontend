import React, { FC, ReactNode } from 'react';
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import { RoomResponse } from '@API';

interface RoomListItemProps {
  item: RoomResponse;
  selected?: boolean;
  onSelect?: (item: RoomResponse) => void;
  children?: ReactNode;
}

export const RoomListItem: FC<RoomListItemProps> = ({
  item,
  selected = false,
  onSelect,
}) => {
  const { name, description, photo } = item;
  const roomName = description || name;

  return (
    <ListItemButton onClick={() => onSelect?.(item)} selected={selected}>
      <ListItemAvatar>
        <Avatar alt={roomName} src={photo} />
      </ListItemAvatar>
      <ListItemText primary={roomName} />
    </ListItemButton>
  );
};

RoomListItem.displayName = 'RoomListItem';
