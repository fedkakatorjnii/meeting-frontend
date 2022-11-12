import React, { FC, ReactNode } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemButton,
  IconButton,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { MessageResponse } from '@API';

interface MessagesListItemProps {
  item: MessageResponse;
  selected?: boolean;
  onSelect?: (item: MessageResponse) => void;
  onDelete?: (item: MessageResponse) => void;
  children?: ReactNode;
}

export const MessagesListItem: FC<MessagesListItemProps> = ({
  item,
  onDelete,
}) => {
  const { text, owner } = item;
  const messagesName = owner.firstName || owner.username;

  return (
    <ListItemButton>
      <ListItemAvatar>
        <Avatar alt={messagesName} src={owner.photo} />
      </ListItemAvatar>
      <ListItemText primary={text} secondary={messagesName} />
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

MessagesListItem.displayName = 'MessagesListItem';
