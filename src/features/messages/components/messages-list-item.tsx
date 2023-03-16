import React, { FC, ReactNode } from 'react';
import {
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
import { addOrJoinStr } from '@common/helpers';

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
  selected,
  onSelect,
  onDelete,
}) => {
  if (!isItem(item)) return null;

  const { isNew, message } = item;
  const { text, owner } = message;

  const badgeContent = isNew ? 0 : 1;
  let messagesName = '';

  messagesName = addOrJoinStr({
    oldValue: messagesName,
    newValue: owner.lastName,
  });
  messagesName = addOrJoinStr({
    oldValue: messagesName,
    newValue: owner.firstName,
  });
  messagesName = addOrJoinStr({
    oldValue: messagesName,
    newValue: owner.username,
  });

  return (
    <ListItemButton onClick={() => onSelect?.(item)} selected={selected}>
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
