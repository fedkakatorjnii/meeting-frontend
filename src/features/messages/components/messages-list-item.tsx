import React, { FC, ReactNode } from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemButton,
  IconButton,
  ListItemSecondaryAction,
  Badge,
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

  const isOld = item.readers.find((reader) => reader.id === owner.id);
  const badgeContent = isOld ? 0 : 1;

  return (
    <ListItemButton>
      <ListItemAvatar>
        <Badge
          color="secondary"
          overlap="circular"
          variant="dot"
          badgeContent={badgeContent}
        >
          <Avatar alt={messagesName} src={owner.photo} />
        </Badge>
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
