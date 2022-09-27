import React, { FC, ReactNode } from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

import { MessageResponse } from '@API';

interface MessagesListItemProps {
  item: MessageResponse;
  selected?: boolean;
  onSelect?: (item: MessageResponse) => void;
  children?: ReactNode;
}

export const MessagesListItem: FC<MessagesListItemProps> = ({ item }) => {
  const { text, owner } = item;
  const messagesName = owner.firstName || owner.username;

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={messagesName} src={owner.photo} />
      </ListItemAvatar>
      <ListItemText primary={text} secondary={messagesName} />
    </ListItem>
  );
};

MessagesListItem.displayName = 'MessagesListItem';
