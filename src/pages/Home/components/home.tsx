import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { LeftDrawer, MainBar, RightDrawer, useRootStore } from '@common';
import { Backdrop, Box, CircularProgress, CssBaseline } from '@ui';

export const HomePage: FC = observer(() => {
  const { authStore } = useRootStore();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    try {
      await authStore.refresh();

      if (!authStore.isAuth) navigate('/start');
    } catch (error) {
      navigate('/start');
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  if (authStore.isLoading) {
    return (
      <Backdrop open={authStore.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <MainBar position="static" />

      <LeftDrawer>
        asd
        {/* TODO */}
      </LeftDrawer>
      <RightDrawer>
        qwe
        {/* TODO */}
      </RightDrawer>
    </Box>
  );
});

HomePage.displayName = 'HomePage';
