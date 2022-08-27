import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { Backdrop, Button, CircularProgress } from '@ui';

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
  const handleLogOut = () => {
    authStore.logout();
    navigate('/start');
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
    <div>
      <h1>Hello Dudes</h1>
      <nav>
        <Button variant="contained" color="primary" onClick={handleLogOut}>
          Выход
        </Button>
      </nav>
      <Backdrop open={authStore.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
});

HomePage.displayName = 'HomePage';
