import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { UserId } from '@API';
import { PrifileLoading, ProfileWrapper } from '../components';
import { Avatar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { coordinatesFormatToString } from '@common/helpers';

const nullValue = '-';

const getValue = <T extends any>({
  value,
  defaultValue = nullValue,
}: {
  value?: T | undefined;
  defaultValue?: string;
}) => {
  if (
    value === '' ||
    Number.isNaN(value) ||
    value === undefined ||
    value === null
  ) {
    return defaultValue;
  }

  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${value}`;
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет';

  return `${value}`;
};

interface ProfileListItemProps {
  value?: any;
  title: string;
}

const ProfileListItem: FC<ProfileListItemProps> = ({ title, value }) => {
  return (
    <Box
      sx={{
        // TODO
        width: '100%',
      }}
    >
      <Typography
        sx={{
          // TODO
          marginRight: '1rem',
        }}
        variant="subtitle1"
        component="span"
      >
        {title}:
      </Typography>
      <Typography
        sx={
          {
            // TODO
          }
        }
        variant="body1"
        component="span"
      >
        {getValue({ value })}
      </Typography>
    </Box>
  );
};

interface ProfileDetailProps {}

export const ProfileDetail: FC<ProfileDetailProps> = observer(() => {
  const { profileStore, currentGeolocationStore } = useRootStore();
  const { loading, error, value } = profileStore.user;

  useEffect(() => {
    profileStore.load();
  }, []);

  if (error) return <>ERROR!</>;
  if (loading) return <PrifileLoading />;
  if (!value) return null;

  const name = value.username;

  const currentCoords = currentGeolocationStore.currentPosition.value?.coords;
  const position = currentCoords
    ? `${coordinatesFormatToString({
        type: 'lat',
        value: currentCoords.latitude,
      })} ${coordinatesFormatToString({
        type: 'lon',
        value: currentCoords.longitude,
      })}`
    : undefined;

  return (
    <ProfileWrapper>
      <Avatar alt={name} src={value.photo} sx={{ width: 56, height: 56 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ProfileListItem title="логин" value={value.username} />
        <ProfileListItem title="имя" value={value.firstName} />
        <ProfileListItem title="фамилия" value={value.lastName} />
        <ProfileListItem title="email" value={value.email} />
        <ProfileListItem title="активный" value={value.isActive} />
        <ProfileListItem title="супер" value={value.isSuperuser} />
        <ProfileListItem title="супер" value={value.isSuperuser} />
        <ProfileListItem title="текущаа позиция" value={position} />
      </Box>
    </ProfileWrapper>
  );
});

ProfileDetail.displayName = 'ProfileDetail';
