import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Backdrop, Button, CircularProgress } from '@ui';
import { useRefresh, useRootStore } from '@common';

export const StartPage = observer(() => {
  const { authStore } = useRootStore();
  const navigate = useNavigate();

  const handleSignUp = () => navigate('/signup');
  const handleSignIn = () => navigate('/signin');

  useRefresh();

  return (
    <div>
      <nav>
        <Button variant="contained" color="primary" onClick={handleSignUp}>
          Рыгыстрация
        </Button>
        <Button variant="contained" color="primary" onClick={handleSignIn}>
          Вход
        </Button>
      </nav>
      <Backdrop open={authStore.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
});

StartPage.displayName = 'StartPage';
