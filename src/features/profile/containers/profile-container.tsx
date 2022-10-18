import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@common';
import { ProfileDetail } from './profile-details';

interface ProfileContainerProps {
  //
}

export const ProfileContainer: FC<ProfileContainerProps> = observer(() => {
  const { authStore } = useRootStore();
  const { authInfo } = authStore;

  if (!authInfo) return null;

  return <ProfileDetail userId={authInfo.userId} />;
});

ProfileContainer.displayName = 'ProfileContainer';
