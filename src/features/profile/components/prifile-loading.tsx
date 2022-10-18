import React, { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CircularProgress } from '@mui/material';
import { styled, experimental_sx as sx } from '@mui/system';

import { ProfileWrapper } from './profile-wrapper';

interface PrifileLoadingProps {
  //
}

export const PrifileLoadingWrapper = styled(ProfileWrapper)(
  sx({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }),
);

export const PrifileLoading: FC<PrifileLoadingProps> = () => {
  return (
    <PrifileLoadingWrapper>
      <CircularProgress color="inherit" />
    </PrifileLoadingWrapper>
  );
};

PrifileLoading.displayName = 'PrifileLoading';
