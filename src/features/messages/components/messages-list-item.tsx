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

interface Item {
  message: MessageResponse;
  isNew: boolean;
}

type PartialItem = Partial<Item>;

const isItem = (value: PartialItem | undefined): value is Item => {
  if (value?.isNew === undefined || !value?.message) return false;

  return true;
};

interface MessagesListItemProps {
  item: PartialItem;
  selected?: boolean;
  onSelect?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  children?: ReactNode;
}

export const MessagesListItem: FC<MessagesListItemProps> = ({
  item,
  onDelete,
}) => {
  if (!isItem(item)) return null;

  const { isNew, message } = item;
  const { text, owner } = message;
  const messagesName = owner.firstName || owner.username;

  const badgeContent = isNew ? 0 : 1;

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
