import React, { FC, ReactNode } from 'react';
import {
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { RoomResponse } from '@API';

interface RoomListItemProps {
  item: RoomResponse;
  selected?: boolean;
  onSelect?: (item: RoomResponse) => void;
  onDelete?: (item: RoomResponse) => void;
  children?: ReactNode;
  actions?: ReactNode;
}

export const RoomListItem: FC<RoomListItemProps> = ({
  item,
  onSelect,
  onDelete,
  selected = false,
}) => {
  const { name, description, photo } = item;
  const roomName = description || name;

  return (
    <ListItemButton onClick={() => onSelect?.(item)} selected={selected}>
      <ListItemAvatar>
        <Avatar alt={roomName} src={photo} />
      </ListItemAvatar>
      <ListItemText primary={roomName} />
      <ListItemSecondaryAction>
        {onDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

RoomListItem.displayName = 'RoomListItem';
