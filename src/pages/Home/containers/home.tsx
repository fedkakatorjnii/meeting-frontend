import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { LeftDrawer, MainBar, RightDrawer, useRootStore } from '@common';
import { Backdrop, Box, CircularProgress, CssBaseline } from '@ui';
import { MessagesContainer } from '@features/messages';

export const HomePage: FC = observer(() => {
  const { authStore, messagesStore } = useRootStore();
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
        <div style={{ height: 64 }}></div>
        <MessagesContainer />
      </LeftDrawer>
      <RightDrawer>
        <div style={{ height: 64 }}></div>
      </RightDrawer>
    </Box>
  );
});

HomePage.displayName = 'HomePage';
