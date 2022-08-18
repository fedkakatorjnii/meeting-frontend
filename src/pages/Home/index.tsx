import React, { FC, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useRootStore } from '@common';
import { Button } from '@ui';

export const Home: FC = observer(() => {
  const { authStore, userStore } = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    authStore.refresh();
  }, []);

  if (authStore.isAuth) {
    return (
      <div>
        <h1>Hello Dudes</h1>
        <nav>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              authStore.logout();
              navigate('/');
            }}
          >
            Выход
          </Button>
        </nav>
      </div>
    );
  }

  return (
    <div>
      <nav>
        <Link to="/signup">Рыгыстрация</Link>
        <Link to="/login">Вход</Link>
      </nav>
    </div>
  );
});
