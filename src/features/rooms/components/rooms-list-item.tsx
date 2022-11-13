import React, { FC, ReactNode } from 'react';
import {
  Avatar,
  Badge,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { MessageCollectionResponse, MessageResponse, RoomResponse } from '@API';
import { observer } from 'mobx-react-lite';
import { getFullUserName } from '@common/helpers';

interface Item {
  room: RoomResponse;
  messages: MessageCollectionResponse;
  count: number;
}

type PartialItem = Partial<Item>;

const isItem = (value: PartialItem | undefined): value is Item => {
  if (!value?.room || !value?.messages) return false;

  return true;
};

const getLastMessage = (
  messages: MessageCollectionResponse,
): MessageResponse | undefined => {
  const { items } = messages;
  const len = items.length;

  if (!len) return;

  return items[len - 1];
};

const getCutText = (text: string, len = 100) => {
  if (!text.length || text.length < len) return text;

  return `${text.slice(0, len - 1)}...`;
};

const getSecondary = (messages: MessageCollectionResponse) => {
  const lastMessage = getLastMessage(messages);

  if (!lastMessage) return null;

  const { owner, text } = lastMessage;
  const fullUserName = getFullUserName(owner);

  const message = ` - ${getCutText(text)}`;

  return (
    <>
      <Typography
        sx={{ display: 'inline' }}
        component="span"
        variant="body2"
        color="text.primary"
      >
        {fullUserName}
      </Typography>
      {message}
    </>
  );
};

interface RoomListItemProps {
  item: PartialItem;
  selected?: boolean;
  onSelect?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  children?: ReactNode;
  actions?: ReactNode;
}

export const RoomListItem: FC<RoomListItemProps> = observer(
  ({ item, onSelect, onDelete, selected = false }) => {
    if (!isItem(item)) return null;

    const { room, messages, count } = item;
    const { name, description, photo } = room;
    const roomName = description || name;
    const secondary = getSecondary(messages);

    return (
      <ListItemButton onClick={() => onSelect?.(item)} selected={selected}>
        <ListItemAvatar>
          <Badge
            color="secondary"
            badgeContent={count}
            overlap="circular"
            // variant="dot"
          >
            <Avatar alt={roomName} src={photo} />
          </Badge>
        </ListItemAvatar>

        <ListItemText primary={roomName} secondary={secondary} />
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
  },
);

RoomListItem.displayName = 'RoomListItem';
